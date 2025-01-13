const express = require("express");
const mongoose = require("mongoose");
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
} = require("../controllers/eventController");
const { authenticate } = require("../controllers/userController");
const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", authenticate(['admin']), createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
