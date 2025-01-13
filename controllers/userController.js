const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Event = require("../models/eventModel");

// Secret key for JWT
const JWT_SECRET = "your_jwt_secret"; // Replace with a secure value

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully", data: newUser });
    } catch (err) {
        res.status(500).json({ msg: "Error in user registration", error: err.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ msg: "Login successful", token });
    } catch (err) {
        res.status(500).json({ msg: "Error in user login", error: err.message });
    }
};

// Middleware for authenticating and authorizing users
const authenticate = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Authentication required" });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;

            // Check role authorization
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ msg: "Access forbidden" });
            }

            next();
        } catch (err) {
            res.status(401).json({ msg: "Invalid token" });
        }
    };
};

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
    registerUser,
    loginUser,
    authenticate,
    createEvent,
    joinEvent,
};
