const prisma = require("../../config/database");
const { ok, fail } = require("../../utils/api-response");
const { buildUniqueSku } = require("../../utils/barcode");
const { parseComponentPartNumber } = require("../../utils/component-parser");
const { logActivity } = require("../../utils/logger");
const { providerOrder, resolveDatasheet } = require("../../utils/datasheet-provider");
const datasheetEnrichment = require("../datasheets/datasheet.service");

function n(v, fallback = null) { return v === "" || v === undefined || v === null ? fallback : Number(v); }
function s(v) { return v === "" || v === undefined ? null : v; }
function mapComponentInput(body, partial = false) {
  const mapped = {
    supplierPartNumber: s(body.supplier_part_number), manufacturerPartNumber: body.manufacturer_part_number, manufacturer: s(body.manufacturer), supplierId: n(body.supplier_id), categoryId: n(body.category_id), name: body.name,
    description: s(body.description), packageCase: s(body.package_case), value: s(body.value), valueNumeric: body.value_numeric ? body.value_numeric : null, unit: s(body.unit), tolerance: s(body.tolerance), voltageRating: s(body.voltage_rating), currentRating: s(body.current_rating), powerRating: s(body.power_rating), temperatureCoefficient: s(body.temperature_coefficient), dielectric: s(body.dielectric), material: s(body.material), footprint: s(body.footprint), mountingType: s(body.mounting_type),
    quantityTotal: n(body.quantity_total, 0), quantityAvailable: n(body.quantity_available, n(body.quantity_total, 0)), quantityReserved: n(body.quantity_reserved, 0), minimumStock: n(body.minimum_stock, 0), reorderQuantity: n(body.reorder_quantity, 0), storageLocationId: n(body.storage_location_id), barcode: s(body.barcode), qrCode: s(body.qr_code), datasheetUrl: s(body.datasheet_url), productUrl: s(body.product_url), imageUrl: s(body.image_url), notes: s(body.notes), status: body.status || "active"
  };
  if (partial) Object.keys(mapped).forEach((k) => mapped[k] === undefined && delete mapped[k]);
  return mapped;
}
async function list(req, res) {
  const page=Math.max(Number(req.query.page||1),1); const limit=Math.min(Math.max(Number(req.query.limit||20),1),100); const q=String(req.query.q||"").trim();
  const and=[]; if(q) and.push({OR:[{internalSku:{contains:q}},{manufacturerPartNumber:{contains:q}},{supplierPartNumber:{contains:q}},{name:{contains:q}},{value:{contains:q}},{packageCase:{contains:q}},{barcode:{contains:q}}]});
  if(req.query.category_id) and.push({categoryId:Number(req.query.category_id)}); if(req.query.supplier_id) and.push({supplierId:Number(req.query.supplier_id)}); if(req.query.out_of_stock==="true") and.push({quantityAvailable:0});
  const where=and.length?{AND:and}:{};
  const [items,total]=await Promise.all([prisma.component.findMany({where,include:{category:true,supplier:true,storageLocation:true},orderBy:{updatedAt:"desc"},skip:(page-1)*limit,take:limit}),prisma.component.count({where})]);
  return ok(res,"Components listed",{items,total,page,limit,pages:Math.max(Math.ceil(total/limit),1)});
}
async function get(req,res){ const item=await prisma.component.findUnique({where:{id:Number(req.params.id)},include:{category:true,supplier:true,storageLocation:true,stockMovements:{orderBy:{createdAt:"desc"},take:50,include:{user:true,project:true}},projectBomItems:{include:{project:true}},componentLabels:{include:{label:true}}}}); if(!item) return fail(res,"Component not found",[],404); return ok(res,"Component detail",item); }
async function create(req,res){ const data=mapComponentInput(req.body); if(data.quantityAvailable + data.quantityReserved > data.quantityTotal) return fail(res,"Available + reserved toplam stoktan fazla olamaz",[],422); const sku = await buildUniqueSku(prisma); const component=await prisma.component.create({data:{...data,internalSku:sku,barcode:data.barcode || sku,qrCode:req.body.qr_code||sku}}); if(component.quantityTotal>0){ await prisma.stockMovement.create({data:{componentId:component.id,movementType:"IN",quantity:component.quantityTotal,quantityBefore:0,quantityAfter:component.quantityAvailable,reason:"Initial stock",userId:req.user?.id}}); } await logActivity(prisma,req,"CREATE","component",component.id,null,component); return ok(res,"Component created successfully",component,201); }
async function update(req,res){ const old=await prisma.component.findUnique({where:{id:Number(req.params.id)}}); if(!old) return fail(res,"Component not found",[],404); const data=mapComponentInput(req.body); if(data.quantityAvailable + data.quantityReserved > data.quantityTotal) return fail(res,"Available + reserved toplam stoktan fazla olamaz",[],422); const component=await prisma.component.update({where:{id:old.id},data}); await logActivity(prisma,req,"UPDATE","component",component.id,old,component); return ok(res,"Component updated successfully",component); }
async function remove(req,res){ const old=await prisma.component.findUnique({where:{id:Number(req.params.id)}}); if(!old) return fail(res,"Component not found",[],404); await prisma.component.delete({where:{id:old.id}}); await logActivity(prisma,req,"DELETE","component",old.id,old,null); return ok(res,"Component deleted successfully"); }
async function stockMove(req,res,type){ const id=Number(req.params.id); const quantity=Number(req.body.quantity); const result=await prisma.$transaction(async(tx)=>{ const c=await tx.component.findUnique({where:{id}}); if(!c) throw new Error("NOT_FOUND"); let available=c.quantityAvailable,total=c.quantityTotal,reserved=c.quantityReserved; if(type==="IN"){available+=quantity;total+=quantity;} if(type==="OUT"){if(available<quantity) throw new Error("NEGATIVE_STOCK"); available-=quantity; total-=quantity;} if(type==="RESERVE"){if(available<quantity) throw new Error("RESERVE_TOO_HIGH"); available-=quantity; reserved+=quantity;} if(type==="RELEASE"){if(reserved<quantity) throw new Error("RELEASE_TOO_HIGH"); available+=quantity; reserved-=quantity;} const updated=await tx.component.update({where:{id},data:{quantityAvailable:available,quantityTotal:total,quantityReserved:reserved}}); const movement=await tx.stockMovement.create({data:{componentId:id,movementType:type,quantity,quantityBefore:c.quantityAvailable,quantityAfter:available,reason:s(req.body.reason),projectId:n(req.body.project_id),userId:req.user?.id||null,notes:s(req.body.notes)}}); return {updated,movement}; }); await logActivity(prisma,req,type,"stock_movement",result.movement.id,null,result.movement); return ok(res,`Stock ${type.toLowerCase()} completed`,result); }
async function movements(req,res){ return ok(res,"Stock movements listed", await prisma.stockMovement.findMany({where:{componentId:Number(req.params.id)},include:{user:true,project:true},orderBy:{createdAt:"desc"}})); }
async function search(req,res){ req.query.q=req.query.q||req.query.term; return list(req,res); }
async function byBarcode(req,res){ const barcode=req.params.barcode; const component=await prisma.component.findFirst({where:{OR:[{barcode},{qrCode:barcode},{internalSku:barcode},{manufacturerPartNumber:barcode}]},include:{category:true,supplier:true,storageLocation:true}}); if(!component) return fail(res,"Component not found",[],404); return ok(res,"Component found",component); }
async function parse(req,res){ return ok(res,"Part number parsed", parseComponentPartNumber(req.query.part_number||req.query.partNumber||"")); }
async function datasheet(req,res){ const component=await prisma.component.findUnique({where:{id:Number(req.params.id)}}); if(!component) return fail(res,"Component not found",[],404); return ok(res,"Datasheet provider result", await resolveDatasheet(component)); }
async function datasheetProviders(req,res){ return ok(res,"Datasheet provider order", providerOrder); }

async function enrich(req, res, next) {
  try {
    const result = await datasheetEnrichment.enrichComponent(req.params.id, { force: req.body?.force === true });
    if (!result) return fail(res, "Component not found", [], 404);
    await logActivity(prisma, req, "ENRICH", "component", Number(req.params.id), null, result.enrichment?.best || null);
    return ok(res, "Component enriched successfully", result);
  } catch (error) {
    return next(error);
  }
}

async function bulkEnrich(req, res, next) {
  try {
    const result = await datasheetEnrichment.bulkEnrich(req.body?.ids || [], { force: req.body?.force === true });
    await logActivity(prisma, req, "BULK_ENRICH", "component", null, null, { count: result.length });
    return ok(res, "Bulk enrichment completed", result);
  } catch (error) {
    return next(error);
  }
}

module.exports={list,get,create,update,remove,movements,search,byBarcode,parse,datasheet,datasheetProviders,enrich,bulkEnrich,stockIn:(req,res,next)=>stockMove(req,res,"IN").catch(next),stockOut:(req,res,next)=>stockMove(req,res,"OUT").catch(next),reserve:(req,res,next)=>stockMove(req,res,"RESERVE").catch(next),release:(req,res,next)=>stockMove(req,res,"RELEASE").catch(next)};
