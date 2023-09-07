const express = require('express');
const announcementController = require("../controllers/announcementController");
const router = express.Router();
//reyans
const path = require('path');
const authUtils = require('../authUtils');

// Route to get all announcements
router.get("/dashboard/user-announcements", authUtils.ensureAuthenticated, announcementController.getAnnouncements);

// Route to create a new announcement
router.post("/dashboard/createAnnouncements", authUtils.ensureAuthenticated, announcementController.createAnnouncement);
//reyans
router.delete("/dashboard/delete-announcements/:id", authUtils.ensureAuthenticated, announcementController.deleteAnnouncements);

module.exports = router;
