const pool = require('../database/db');
const dbQueries = require('../database/queries');

//pending tasks
const getPendingTasks = async (req, res) => {
    try {
        const user1 = req.user;
        console.log(req.user);
        const user_id = user1.user.id;

        const getOrganizationIdQuery = dbQueries.getUserOrganizationByUserId;
        const organizationIdResult = await pool.query(getOrganizationIdQuery, [user_id]);

        if (organizationIdResult.rows.length > 0) {
            const retrievedOrganizationId = organizationIdResult.rows[0].organization_id;
            const pendingTasksQuery = dbQueries.getPendingTasksByOrgId;
            const pendingTasksResult = await pool.query(pendingTasksQuery, [retrievedOrganizationId]);
            //Processing and sending response
            res.status(200).json({ success: true, data: pendingTasksResult.rows });
        } else {
            res.status(400).json({ error: 'No Organization Id' });
        }

    } catch (error) {
        console.log('Error fetching pending tasks', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//Completed tasks
const getCompletedTasks = async (req, res) => {
    try {
        const user_id = req.user.id;
        const completedTasksQuery = dbQueries.getCompletedTasksByUserIdQuery;
        const completedTasksResult = await pool.query(completedTasksQuery, [user_id]);

        res.status(200).json({ completedTasks: completedTasksResult.rows })
    } catch (error) {
        console.log('Error fetching completed tasks');
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getPendingTasks,
    getCompletedTasks,
}