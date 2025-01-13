const express = require("express");
const mongoose = require("mongoose");
const { getAllEvents, createEvent, updateEvent, deleteEvent, getEventById } = require("../controllers/eventController");
const router = express.Router();


router.get('/', getAllEvents);
router.get('/:id', getEventById)
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);



module.exports = router