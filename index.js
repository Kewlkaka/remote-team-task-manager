const http = require('http'); //Reyans
const express = require('express');
const cors = require('cors'); //Reyans
const app = express();
const server = http.createServer(app); //Reyans
const socketIo = require('socket.io');
const io = socketIo(server); //Reyans
const setupWebSocket = require('./websocket');
const axios = require('axios');
const authUtils = require('./authUtils'); //Reyans
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const dbQueries = require('./database/queries');
const pool = require('./database/db'); //importing db connection module
const session = require('express-session'); //Reyans

//session middleware
app.use(cors({
    origin: 'http://localhost:3000', // Set the allowed origin (your frontend URL)
    credentials: true, // Allow credentials (cookies, HTTP authentication)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(
    session({
        secret: 'secrettexthere',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);


const passport = require('./passport');
app.use(passport.initialize());
app.use(passport.session());
require('./websocket')(server);


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public'))); //Reyans
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), { "extensions": ["js"] }));
app.use('/css', (req, res, next) => {
    res.type('text/css');
    next(); //Reyans
}, express.static(path.join(__dirname, 'public', 'css')));
app.get('/socket.io/socket.io.js', (req, res) => { //reyanscode
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
}); //Reyans

setupWebSocket(io);

app.use(express.json());

const ensureAuthenticated = (req, res, next) => {
    console.log('ensureAuthenticated middleware called'); //Reyans
    if (req.isAuthenticated()) {
        console.log("Authentication Success");
        return next(); //rtcode
    }
    res.redirect('/sign-in/login');
}; //Reyans

const axiosConfig = {
    withCredentials: true
};

app.set('view engine', 'ejs');

const PORT = 3000;


//User Routes
const userRoutes = require('./routes/userRoutes');
//Task Routes, reyan
const taskRoutes = require('./routes/taskRoutes');
//Announcement Routes
const announcementRoutes = require('./routes/announcementRoutes');

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/announcements', announcementRoutes);

//Home Route
app.get('/', (req, res) => {
    res.render('index');
});

//User Signup Route
app.get('/create-account/signup/orgAccount', (req, res) => { //Reyans
    res.render('signup');
});

//User Login Route
app.get('/sign-in/login', (req, res) => {
    res.render('login');
});

//User Dashboard Route
app.get('/dashboard', authUtils.ensureAuthenticated, async (req, res) => {
    try { //reyan
        const pendingTasks = await axios.get('http://localhost:3000/tasks/dashboard/pending-tasks', axiosConfig);
        const completedTasks = await axios.get('http://localhost:3000/tasks/dashboard/completed-tasks', axiosConfig);
        const userAnnouncements = await axios.get('http://localhost:3000/announcements/dashboard/user-announcements', axiosConfig); //reyan

        res.render("dashboard", {
            user1: req.user,
            pendingTasks: pendingTasks.data,
            completedTasks: completedTasks.data,
            getAnnouncement: userAnnouncements.data,
        });
    } catch (error) { //Reyans
        console.log("Error fetching data for dashboard:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    //reyanscode
});

module.exports = {
    ensureAuthenticated
}

//Starting Server
server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});