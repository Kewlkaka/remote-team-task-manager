/*User Related */
const createUserQuery = 'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *';
const getUserByEmailQuery = 'SELECT * FROM users WHERE email = $1';
const getUserById = `SELECT * FROM users WHERE id = $1`; //reyans
const getUserByUsernameQuery = 'SELECT * FROM users WHERE username = $1';
//reyans
/*Organization*/
const createOrganizationQuery = 'INSERT INTO organizations VALUES ($1, $2, $3) RETURNING *';
const createUserOrganizationQuery = 'INSERT INTO user_organization (user_id, organization_id) VALUES ($1, $2) RETURNING *';

//User_Organization
const getUserOrganizationByUserId = 'SELECT organization_id FROM user_organization WHERE user_id = $1'; //reyans

//User_Permissions
const createUserPermissions = `INSERT INTO user_permissions VALUES ($1, $2) RETURNING *`;

/*Task Related*/
const getPendingTasksByOrgId = `SELECT * FROM tasks WHERE organization_id = $1 AND status = 'Pending'`;
const getCompletedTasksByUserIdQuery = `SELECT * FROM tasks WHERE user_id = $1 AND status = 'Completed'`; //reyans

/* Announcement Related */
const getAnnouncements = `SELECT * FROM announcements WHERE user_id = $1`
const createAnnouncement = `INSERT INTO announcements (title, content, user_id)
VALUES ($1, $2, $3) RETURNING id`;
const deleteAnnouncement = `DELETE FROM announcements WHERE id = $1`; //reyans

module.exports = {
    //User
    createUserQuery,
    getUserByEmailQuery,
    getUserById,
    getUserByUsernameQuery,
    //Organization
    createOrganizationQuery,
    createUserOrganizationQuery,
    //User_Organization
    getUserOrganizationByUserId,
    //User_Permissions
    createUserPermissions,
    //Task
    getPendingTasksByOrgId,
    getCompletedTasksByUserIdQuery,
    //Announcement
    getAnnouncements,
    createAnnouncement,
    deleteAnnouncement,
}