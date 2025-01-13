const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Event = require("../models/eventModel");



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


module.exports ={
    authenticate
}
