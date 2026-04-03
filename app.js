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

app.use("/api/users", usersRouter);
app.use("/equipment", equipmentRouter);
app.use("/handover", handoverRouter);
app.use("/swap-requests", swapRequestRouter);
app.use("/analytics", analyticsRouter);
app.use("/api/events", eventRoutes);
app.use("/api/task-slots", taskSlotRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
