const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  const adminPass = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { name: "Default Admin", email: "admin@example.com", passwordHash: adminPass, role: "admin" }
  });

  const categories = [
    { name: "Resistor", nameTr: "Direnç", nameEn: "Resistor" },
    { name: "Capacitor", nameTr: "Kondansatör", nameEn: "Capacitor" },
    { name: "Inductor", nameTr: "Bobin", nameEn: "Inductor" },
    { name: "Diode", nameTr: "Diyot", nameEn: "Diode" },
    { name: "LED", nameTr: "LED", nameEn: "LED" },
    { name: "IC", nameTr: "Entegre", nameEn: "IC" },
    { name: "Connector", nameTr: "Konnektör", nameEn: "Connector" },
    { name: "Fuse", nameTr: "Sigorta", nameEn: "Fuse" },
    { name: "TVS / ESD", nameTr: "TVS / ESD", nameEn: "TVS / ESD" },
    { name: "Crystal", nameTr: "Kristal", nameEn: "Crystal" },
    { name: "Module", nameTr: "Modül", nameEn: "Module" },
    { name: "Other", nameTr: "Diğer", nameEn: "Other" }
  ];
  for (const item of categories) {
    await prisma.category.upsert({ where: { slug: slugify(item.name) }, update: item, create: { ...item, slug: slugify(item.name) } });
  }

  const suppliers = ["Özdisan", "Direnc.net", "Robotistan", "Mouser", "Digikey", "LCSC", "AliExpress", "Farnell"];
  for (const name of suppliers) {
    await prisma.supplier.upsert({ where: { name }, update: {}, create: { name } });
  }

  const locs = [
    { name: "Raf A", nameTr: "Raf A", nameEn: "Shelf A", code: "RAF-A" },
    { name: "SMD Direnç Kutusu", nameTr: "SMD Direnç Kutusu", nameEn: "SMD Resistor Box", code: "SMD-R" },
    { name: "SMD Kapasitör Kutusu", nameTr: "SMD Kapasitör Kutusu", nameEn: "SMD Capacitor Box", code: "SMD-C" },
    { name: "Reel Box 01", nameTr: "Reel Box 01", nameEn: "Reel Box 01", code: "REEL-01" }
  ];
  for (const l of locs) await prisma.storageLocation.upsert({ where: { code: l.code }, update: {}, create: l });

  const resistor = await prisma.category.findUnique({ where: { slug: "resistor" } });
  const capacitor = await prisma.category.findUnique({ where: { slug: "capacitor" } });
  const diode = await prisma.category.findUnique({ where: { slug: "diode" } });
  const tvs = await prisma.category.findUnique({ where: { slug: "tvs-esd" } });
  const oz = await prisma.supplier.findUnique({ where: { name: "Özdisan" } });
  const locR = await prisma.storageLocation.findUnique({ where: { code: "SMD-R" } });
  const locC = await prisma.storageLocation.findUnique({ where: { code: "SMD-C" } });
  const locD = await prisma.storageLocation.findUnique({ where: { code: "REEL-01" } });

  const samples = [
    { internalSku: "CMP-R7K2M9QA", manufacturerPartNumber: "RC0402FR-07330RL", manufacturer: "YAGEO", categoryId: resistor.id, name: "330 Ohm 0402 Resistor", value: "330 Ohm", packageCase: "0402", tolerance: "1%", powerRating: "1/16W", temperatureCoefficient: "100PPM", supplierId: oz.id, quantityTotal: 100, quantityAvailable: 100, minimumStock: 20, storageLocationId: locR.id },
    { internalSku: "CMP-C4T8N2PX", manufacturerPartNumber: "CL21B104KBCNNND", manufacturer: "Samsung", categoryId: capacitor.id, name: "100nF 0805 MLCC", value: "100nF", packageCase: "0805", tolerance: "10%", supplierId: oz.id, quantityTotal: 200, quantityAvailable: 200, minimumStock: 30, storageLocationId: locC.id },
    { internalSku: "CMP-J6V3L9KD", manufacturerPartNumber: "CL21C220JBANNNC", manufacturer: "Samsung", categoryId: capacitor.id, name: "22pF 0805 MLCC", value: "22pF", packageCase: "0805", supplierId: oz.id, quantityTotal: 150, quantityAvailable: 150, minimumStock: 20, storageLocationId: locC.id },
    { internalSku: "CMP-D8Q5W2ZA", manufacturerPartNumber: "B340A-13-F", manufacturer: "Diodes Inc.", categoryId: diode.id, name: "B340A Schottky Diode", value: "3A 40V", packageCase: "SMA", supplierId: oz.id, quantityTotal: 50, quantityAvailable: 50, minimumStock: 10, storageLocationId: locD.id },
    { internalSku: "CMP-T3S7E6HB", manufacturerPartNumber: "SMBJ5.0A", manufacturer: null, categoryId: tvs.id, name: "SMBJ5.0A TVS Diode", voltageRating: "5V", packageCase: "SMB", supplierId: oz.id, quantityTotal: 50, quantityAvailable: 50, minimumStock: 10, storageLocationId: locD.id }
  ];

  for (const s of samples) {
    await prisma.component.upsert({
      where: { internalSku: s.internalSku },
      update: {},
      create: { ...s, barcode: s.internalSku, qrCode: s.internalSku }
    });
  }
}

main().finally(() => prisma.$disconnect());
