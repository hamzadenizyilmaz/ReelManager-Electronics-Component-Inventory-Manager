const prisma = require("../../config/database");
const { ok, fail } = require("../../utils/api-response");
const { logActivity } = require("../../utils/logger");

function slugify(value) {
  return String(value || "").trim().toLowerCase().replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
function data(body){ return { name: body.name, nameTr: body.name_tr || body.nameTr || body.name || null, nameEn: body.name_en || body.nameEn || body.name || null, slug: body.slug || slugify(body.name), description: body.description || null, descriptionTr: body.description_tr || body.descriptionTr || body.description || null, descriptionEn: body.description_en || body.descriptionEn || body.description || null }; }
async function list(req,res){ return ok(res,"Categories listed", await prisma.category.findMany({ orderBy:{ name:"asc" } })); }
async function get(req,res){ const item=await prisma.category.findUnique({where:{id:Number(req.params.id)}}); if(!item) return fail(res,"Category not found",[],404); return ok(res,"Category detail",item); }
async function create(req,res){ const item=await prisma.category.create({data:data(req.body)}); await logActivity(prisma,req,"CREATE","category",item.id,null,item); return ok(res,"Category created",item,201); }
async function update(req,res){ const old=await prisma.category.findUnique({where:{id:Number(req.params.id)}}); if(!old) return fail(res,"Category not found",[],404); const item=await prisma.category.update({where:{id:old.id},data:data(req.body)}); await logActivity(prisma,req,"UPDATE","category",item.id,old,item); return ok(res,"Category updated",item); }
async function remove(req,res){ const old=await prisma.category.findUnique({where:{id:Number(req.params.id)}}); if(!old) return fail(res,"Category not found",[],404); await prisma.category.delete({where:{id:old.id}}); await logActivity(prisma,req,"DELETE","category",old.id,old,null); return ok(res,"Category deleted"); }
module.exports={list,get,create,update,remove};
