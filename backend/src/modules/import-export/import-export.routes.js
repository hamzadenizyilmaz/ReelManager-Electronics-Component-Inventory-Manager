const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const multer = require("multer");
const Papa = require("papaparse");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");
const prisma = require("../../config/database");
const { ok, fail } = require("../../utils/api-response");

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
router.use(auth);

function safeText(value) {
  if (value === null || value === undefined) return "-";
  return String(value);
}

function drawRow(doc, columns, y, options = {}) {
  const { header = false } = options;
  const rowHeight = 24;
  const x = 40;
  const widths = [86, 150, 70, 48, 52, 52, 74];

  doc.lineWidth(0.5).strokeColor("#d1d5db");
  doc.rect(x, y, widths.reduce((a, b) => a + b, 0), rowHeight).stroke();

  let currentX = x;
  widths.forEach((width, index) => {
    if (index > 0) doc.moveTo(currentX, y).lineTo(currentX, y + rowHeight).stroke();
    doc.font(header ? "Helvetica-Bold" : "Helvetica").fontSize(header ? 8 : 7).fillColor("#111827");
    doc.text(safeText(columns[index]), currentX + 4, y + 7, {
      width: width - 8,
      height: rowHeight - 8,
      ellipsis: true
    });
    currentX += width;
  });

  return y + rowHeight;
}

function drawFooter(doc, pageNumber) {
  const bottom = doc.page.height - 40;
  doc.font("Helvetica").fontSize(8).fillColor("#6b7280");
  doc.text(`SMD Stock Manager - BOM Export - Page ${pageNumber}`, 40, bottom, {
    align: "center",
    width: doc.page.width - 80
  });
}

function drawHeader(doc, project) {
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#111827").text("BOM Export", 40, 40);
  doc.font("Helvetica").fontSize(10).fillColor("#374151");
  doc.text(`Project: ${safeText(project.name)}`, 40, 68);
  doc.text(`Code: ${safeText(project.code)}`, 40, 84);
  doc.text(`Status: ${safeText(project.status)}`, 40, 100);
  doc.text(`Generated: ${new Date().toLocaleString("tr-TR")}`, 40, 116);

  const totalRequired = project.bomItems.reduce((sum, item) => sum + item.requiredQuantity, 0);
  const totalMissing = project.bomItems.reduce((sum, item) => {
    const available = item.component?.quantityAvailable || 0;
    return sum + Math.max(item.requiredQuantity - available, 0);
  }, 0);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(totalMissing > 0 ? "#991b1b" : "#166534");
  doc.text(`Total BOM lines: ${project.bomItems.length} | Required Qty: ${totalRequired} | Missing Qty: ${totalMissing}`, 40, 136);
}

router.post("/import/components", upload.single("file"), async (req, res) => {
  if (!req.file) return fail(res, "File is required", [], 422);
  const name = String(req.file.originalname || "").toLowerCase();
  let rows = [];
  let errors = [];

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const firstSheet = workbook.SheetNames[0];
    rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" });
  } else {
    const text = req.file.buffer.toString("utf8");
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    rows = parsed.data;
    errors = parsed.errors;
  }

  const preview = rows.map((row, index) => ({
    index: index + 1,
    row,
    valid: !!row.manufacturer_part_number || !!row.manufacturerPartNumber,
    duplicate_key: `${row.manufacturer_part_number || row.manufacturerPartNumber || ""}|${row.package_case || row.packageCase || ""}|${row.value || ""}`
  }));
  ok(res, "Import preview generated", { rows: preview, errors });
});

router.get("/export/components/csv", async (req, res) => {
  const items = await prisma.component.findMany({ include: { category: true, supplier: true, storageLocation: true } });
  const csv = Papa.unparse(items.map((x) => ({
    internal_sku: x.internalSku,
    manufacturer_part_number: x.manufacturerPartNumber,
    supplier_part_number: x.supplierPartNumber,
    manufacturer: x.manufacturer,
    category: x.category?.name,
    supplier: x.supplier?.name,
    value: x.value,
    package_case: x.packageCase,
    quantity_total: x.quantityTotal,
    quantity_available: x.quantityAvailable,
    quantity_reserved: x.quantityReserved,
    minimum_stock: x.minimumStock,
    location: x.storageLocation?.name
  })));
  res.setHeader("content-type", "text/csv; charset=utf-8");
  res.setHeader("content-disposition", "attachment; filename=components.csv");
  res.send("\ufeff" + csv);
});

router.get("/export/components/xlsx", async (req, res) => {
  const items = await prisma.component.findMany({ include: { category: true, supplier: true, storageLocation: true } });
  const rows = items.map((x) => ({
    internal_sku: x.internalSku,
    manufacturer_part_number: x.manufacturerPartNumber,
    supplier_part_number: x.supplierPartNumber,
    manufacturer: x.manufacturer,
    category: x.category?.name,
    supplier: x.supplier?.name,
    value: x.value,
    package_case: x.packageCase,
    quantity_total: x.quantityTotal,
    quantity_available: x.quantityAvailable,
    quantity_reserved: x.quantityReserved,
    minimum_stock: x.minimumStock,
    location: x.storageLocation?.name
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "components");
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader("content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("content-disposition", "attachment; filename=components.xlsx");
  res.send(buffer);
});

router.get("/export/projects/:id/bom/pdf", async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    if (!Number.isInteger(projectId) || projectId <= 0) {
      return fail(res, "Invalid project id", [], 422);
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        bomItems: {
          orderBy: { id: "asc" },
          include: {
            component: {
              include: {
                category: true,
                supplier: true,
                storageLocation: true
              }
            }
          }
        }
      }
    });

    if (!project) return fail(res, "Project not found", [], 404);

    const safeFileName = `${project.code || `project-${project.id}`}`.replace(/[^a-z0-9_-]+/gi, "-").toLowerCase();
    res.setHeader("content-type", "application/pdf");
    res.setHeader("content-disposition", `attachment; filename=${safeFileName}-bom.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true });
    doc.pipe(res);

    let pageNumber = 1;
    drawHeader(doc, project);
    let y = 170;
    y = drawRow(doc, ["Ref", "Part Number", "Value", "Pkg", "Req", "Avail", "Status"], y, { header: true });

    for (const item of project.bomItems) {
      if (y > 740) {
        drawFooter(doc, pageNumber++);
        doc.addPage();
        drawHeader(doc, project);
        y = 170;
        y = drawRow(doc, ["Ref", "Part Number", "Value", "Pkg", "Req", "Avail", "Status"], y, { header: true });
      }

      const component = item.component;
      const available = component?.quantityAvailable || 0;
      const missing = Math.max(item.requiredQuantity - available, 0);
      const status = missing === 0 ? "OK" : `MISSING ${missing}`;

      y = drawRow(doc, [
        item.referenceDesignator || "-",
        component?.manufacturerPartNumber || `Component #${item.componentId}`,
        component?.value || "-",
        component?.packageCase || "-",
        item.requiredQuantity,
        available,
        status
      ], y);

      if (item.notes || component?.storageLocation?.name || component?.supplier?.name) {
        doc.font("Helvetica").fontSize(7).fillColor("#6b7280");
        doc.text(
          `Supplier: ${safeText(component?.supplier?.name)} | Location: ${safeText(component?.storageLocation?.name)} | Notes: ${safeText(item.notes)}`,
          44,
          y - 5,
          { width: 510, ellipsis: true }
        );
      }
    }

    if (project.bomItems.length === 0) {
      doc.font("Helvetica").fontSize(11).fillColor("#6b7280").text("This project has no BOM items yet.", 40, y + 24);
    }

    drawFooter(doc, pageNumber);
    doc.end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
