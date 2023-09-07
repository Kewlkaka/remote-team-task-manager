const pool = require('../database/db');
const dbQueries = require('../database/queries');
const formidable = require('formidable');
const { getIo } = require('../websocket');


//get Announcements
const getAnnouncements = async (req, res) => {
    try {
        const user_id = req.user.id;
        const getAnnouncementsQuery = dbQueries.getAnnouncements;
        const getAnnouncementsResult = await pool.query(getAnnouncementsQuery, [user_id]);

        res.status(200).json({ completedTasks: getAnnouncementsResult.rows })
    } catch (error) {
        console.log('Error fetching completed tasks');
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Create Announcement
const createAnnouncement = async (req, res) => {
    try {
        console.log("Inside announcementController.createAnnouncement");
        const io = getIo();

        const form = new formidable.IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form data:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log("Received Form Fields:", fields);

                const { announcementTitle, announcementText } = fields;
                const user_id = req.user.id;

                console.log(announcementTitle);
                console.log(announcementText);

                // Your database query to insert the new announcement
                const createAnnouncementQuery = dbQueries.createAnnouncement;
                const result = await pool.query(createAnnouncementQuery, [announcementTitle, announcementText, user_id]);

                const newAnnouncementId = result.rows[0].id;

                io.emit('new announcement', {
                    id: newAnnouncementId,
                    title: announcementTitle,
                    content: announcementText,
                    created_at: new Date().toLocaleString()
                });

                res.status(201).json({ id: newAnnouncementId, message: 'Announcement created successfully' });
            }
        });
    } catch (error) {
        console.log('Error creating announcement:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteAnnouncements = async (req, res) => {
    try {
        console.log("Inside announcementController.deleteAnnouncement");
        const announcementId = req.params.id;

        console.log(announcementId);

        const deleteAnnouncementQuery = dbQueries.deleteAnnouncement;
        const deleteAnnouncementsResult = await pool.query(deleteAnnouncementQuery, [announcementId]);

        console.log("Success");

        res.status(200).json({ message: 'Announcement deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncements,
};
