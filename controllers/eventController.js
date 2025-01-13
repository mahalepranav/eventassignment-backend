const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/eventModel");

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const allEvents = await Event.find();
        res.status(200).json({ 'msg': 'Events found', 'data': allEvents });
    } catch (err) {
        res.status(500).json({ 'msg': 'Error in getting events' });
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ 'msg': 'Event not found' });
        }
        res.status(200).json({ 'msg': 'Event found', 'data': event });
    } catch (err) {
        res.status(500).json({ 'msg': 'Error in fetching event by ID' });
    }
};

// Create a new event
// const createEvent = async (req, res) => {
//     try {
//         const newEvent = new Event(req.body);
//         await newEvent.save();
//         res.status(201).json({ 'msg': 'Event created successfully', 'data': newEvent });
//     } catch (err) {
//         res.status(500).json({ 'msg': 'Error in creating event' });
//     }
// };

// Admin can create events
const createEvent = async (req, res) => {
    try {
        const { userId } = req.user; // Extract from token
        const { name, description, date } = req.body;

        const newEvent = new Event({
            name,
            description,
            date,
            owner: userId,
        });

        await newEvent.save();
        res.status(201).json({ msg: "Event created successfully", data: newEvent });
    } catch (err) {
        res.status(500).json({ msg: "Error in creating event", error: err.message });
    }
};

// Update an event by ID
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ 'msg': 'Event not found' });
        }
        res.status(200).json({ 'msg': 'Event updated successfully', 'data': updatedEvent });
    } catch (err) {
        res.status(500).json({ 'msg': 'Error in updating event' });
    }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ 'msg': 'Event not found' });
        }
        res.status(200).json({ 'msg': 'Event deleted successfully', 'data': deletedEvent });
    } catch (err) {
        res.status(500).json({ 'msg': 'Error in deleting event' });
    }
};

// Attendee can join an event
const joinEvent = async (req, res) => {
    try {
        const { userId } = req.user; // Extract from token
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ msg: "Event not found" });
        }

        // Add user to the attendees list and update their joined events
        event.attendees.push(userId);
        await event.save();

        await User.findByIdAndUpdate(userId, { $push: { eventsJoined: eventId } });

        res.status(200).json({ msg: "Joined event successfully", data: event });
    } catch (err) {
        res.status(500).json({ msg: "Error in joining event", error: err.message });
    }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
};