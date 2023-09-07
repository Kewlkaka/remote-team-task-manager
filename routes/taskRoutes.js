const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();
const path = require('path');
//reyans
const authUtils = require('../authUtils');

//completed tasks
router.get('/dashboard/completed-tasks', authUtils.ensureAuthenticated, taskController.getCompletedTasks);

//pending tasks
router.get('/dashboard/pending-tasks', authUtils.ensureAuthenticated, taskController.getPendingTasks);
//reyans
module.exports = router;