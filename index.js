const app = require("./app");
const { query } = require("./db");
const { createUsersTable } = require("./models/userModel");
const { createEquipmentTable } = require("./models/equipmentModel");
const { createHandoverLogsTable } = require("./models/handoverLogModel");
const { createSwapRequestsTable } = require("./models/swapRequestModel");
const PORT = process.env.PORT || 5000;

async function startServer() {
  await createUsersTable();
  await createEquipmentTable();
  await createHandoverLogsTable();
  await createSwapRequestsTable();
  await query("SELECT 1");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
