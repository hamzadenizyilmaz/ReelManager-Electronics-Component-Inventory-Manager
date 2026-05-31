const app = require("./app");
const { port } = require("./config/env");
const prisma = require("./config/database");

async function start() {
  await prisma.$connect();
  app.listen(port, () => console.log(`SMD Stock Manager API listening on http://localhost:${port}`));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
