const express = require("express");
const cors = require("cors");
const { query } = require("./db");

const usersRouter = require("./routes/usersRoutes");
const equipmentRouter = require("./routes/equipmentRoutes");
const handoverRouter = require("./routes/handoverRoutes");
const swapRequestRouter = require("./routes/swapRequestRoutes");
const analyticsRouter = require("./routes/analyticsRoutes");
const eventRoutes = require("./routes/eventRoutes");
const taskSlotRoutes = require("./routes/taskSlotRoutes");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (req, res, next) => {
  try {
    await query("SELECT 1");

    return res.status(200).json({
      success: true,
      data: {
        postgres: "ok",
      },
      message: "Service is healthy",
    });
  } catch (error) {
    return next(error);
  }
});

// Use the auth middleware to protect these routes
app.use("/api/users", authMiddleware, usersRouter);
app.use("/equipment", authMiddleware, equipmentRouter);
app.use("/handover", authMiddleware, handoverRouter);
app.use("/swap-requests", authMiddleware, swapRequestRouter);
app.use("/analytics", authMiddleware, analyticsRouter);
app.use("/api/events", authMiddleware, eventRoutes);
app.use("/api/task-slots", authMiddleware, taskSlotRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
