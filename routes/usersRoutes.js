const express = require("express");
const {
  getUsers,
  getUser,
  createUserHandler,
  patchUser,
  patchUserAvailability,
} = require("../controllers/usersController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUserHandler);
router.patch("/:id", patchUser);
router.patch("/:id/availability", patchUserAvailability);

module.exports = router;
