const crypto = require("crypto");

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSkuBody(length = 8) {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

function buildSku() {
  return `CMP-${randomSkuBody(8)}`;
}

async function buildUniqueSku(prisma) {
  for (let i = 0; i < 8; i += 1) {
    const sku = buildSku();
    const exists = await prisma.component.findUnique({ where: { internalSku: sku } });
    if (!exists) return sku;
  }
  return `CMP-${randomSkuBody(10)}`;
}

module.exports = { buildSku, buildUniqueSku };
