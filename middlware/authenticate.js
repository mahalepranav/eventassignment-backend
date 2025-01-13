const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Event = require("../models/eventModel");

// Middleware for authenticating and authorizing users
const authenticate = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, "your_jwt_secret");
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

module.exports = {
  authenticate,
};
