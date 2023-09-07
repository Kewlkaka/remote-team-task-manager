//controllers/userController.js
const bcrypt = require('bcrypt');
const emailValidator = require('validator');
const passwordValidator = require('password-validator');
const pool = require('../database/db');
const dbQueries = require('../database/queries');
const passport = require('passport'); // Import passport for authentication

//Utility Functions:
function emailValidate(emailStr) {
    return emailValidator.isEmail(emailStr);
}

function passwordValidate(passwordStr) {
    const schema = new passwordValidator();
    schema
        .is().min(8) //8 minimum characters
        .has().uppercase() //atleast 1 uppercase char
        .has().digits() //atleast 1 digit
        .has().not().spaces(); //no spaces
    return schema.validate(passwordStr);
}

//SIGNUP
const signup = async (req, res, next) => {
    console.log("Inside userController.signup");
    console.log("Received Request Body:", req.body);
    try {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const name = req.body.name;
        const website = req.body.website;
        const industry = req.body.industry;

        //Checking Email Validity:
        if (!emailValidate(email)) {
            return res.status(401).json({ error: 'Please provide a valid email address' })
        }

        //Checking if User with same Email exists:
        const verifyExistingEmailQuery = dbQueries.getUserByEmailQuery;
        const existingEmailValue = [email];
        const existingEmailResult = await pool.query(verifyExistingEmailQuery, existingEmailValue);

        if (existingEmailResult.rows.length > 0) {
            return res.status(401).json({ error: 'Account already exists' });
        }

        //Checking Password Validity:
        if (!passwordValidate(password)) {
            return res.status(401).json({
                error: 'Password must be 8 characters and include an uppercase character and a number, without spaces'
            });
        }

        //Checking if User with same Username exists:
        const existingUsernameQuery = dbQueries.getUserByUsernameQuery;
        const existingUsernameValue = [username];
        const existingUsernameResult = await pool.query(existingUsernameQuery, existingUsernameValue);

        if (existingUsernameResult.rows.length > 0) {
            return res.status(401).json({ error: 'Username already exists' })
        }

        //Hashing password before storing it in database
        const hashedPassword = await bcrypt.hash(password, 10);

        //Storing information in Users table.
        const query = dbQueries.createUserQuery;
        const values = [email, hashedPassword, username];

        const userResult = await pool.query(query, values);
        const user_id = userResult.rows[0].id;

        //Storing information in Organizations table.
        const createOrgQuery = dbQueries.createOrganizationQuery;
        const createOrgValue = [name, website, industry];

        const orgResult = await pool.query(createOrgQuery, createOrgValue);
        const organization_id = orgResult.rows[0].id;

        //Storing information in user_organization table.
        const createUserOrgQuery = dbQueries.createUserOrganizationQuery;
        const createUserOrgValue = [user_id, organization_id];

        await pool.query(createUserOrgQuery, createUserOrgValue);

        //Storing information in user_permissions table
        const createUserPermissionsQuery = dbQueries.createUserPermissions;
        const permission_id = 1; //reyans
        const createUserPermissionValue = [user_id, permission_id];

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error("Error in passport authentication:", err);
                return next(err);
            }
            if (!user) {
                // Authentication failed
                console.log('User Auth Failed');
                return res.redirect('/create-account/signup/orgAccount'); // Redirect to signup page
            }
            console.log('Auth successful');
            req.login(user, (err) => {
                if (err) {
                    console.error('Error during req.login:', err);
                    return next(err);
                }
                console.log('User session created:', req.user);
                return res.redirect('/dashboard');
            });
        })(req, res, next);

    } catch (error) {
        console.error("Error in user signup:", error);
        res.status(500).json({ error: 'Internal Server Error, Signup failed', details: error.message });
    }
};

//LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Validate Email.
        if (!emailValidate(email)) {
            return res.status(401).json({ error: 'Please provide a valid email address' })
        }

        //Retrieve if user exists on the basis on their email
        const query = dbQueries.getUserByEmailQuery;
        const values = [email];
        const result = await pool.query(query, values);

        //If no user found:
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Email' });
        }

        const user = result.rows[0];
        //Compare Password with stored hash password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error("Error in passport authentication:", err);
                return next(err);
            }
            if (!user) {
                // Authentication failed, handle accordingly
                console.log('User Auth Failed');
                return res.redirect('/sign-in/login'); // Redirect to signup page
            }
            console.log('Auth successful');
            req.login(user, (err) => {
                if (err) { //reyans
                    console.error('Error during req.login:', err);
                    return next(err);
                }
                console.log('User session created:', req.user);
                return res.redirect('/dashboard');
            });
        })(req, res, next);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error, Login Unsuccessful, Please try again later' });
    }
};

module.exports = {
    signup,
    login,
};