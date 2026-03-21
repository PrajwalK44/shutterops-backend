const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/usersRoutes");
const { query } = require("./db");
const { createUsersTable } = require("./models/userModel");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res, next) => {
  try {
    await query("SELECT 1");
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    return next(error);
  }
});

app.use("/api/users", usersRouter);

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({ message });
});

async function startServer() {
  await createUsersTable();
  await query("SELECT 1");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
