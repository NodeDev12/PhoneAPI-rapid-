    const express = require("express");
    const path = require("path");
    const session = require("express-session");
    const collection = require("./config");
    const EmailValidationResultModel = require("./emailValidationResultModel");
    const axios = require('axios');
    const PhoneValidation = require("./phoneValidation")
    const app = express();

    const rapid_api_key='26beb044cbmshe1f334dd6a4877dp18eda9jsn9c9e1e0bdeb6'



    // convert data into json format
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Static file
    app.use(express.static(path.join(__dirname, '../public')));
    const templatePath = path.join(__dirname, '../views');

    const publicPath = path.join(__dirname, '../public');
    // use EJS as the view engine
    app.set("view engine", "ejs");
    app.set('views', templatePath);
    app.use(session({
        secret: "shymkent", // Change this to a secret key for session encryption
        resave: false,
        saveUninitialized: true
    }));

    app.get("/", (req, res) => {
        res.render("login");
    });
    // Add this route before the app.post("/validate-number", async (req, res) => { ... }) route


    app.get("/signup", (req, res) => {
        res.render("signup");
    });
    app.get("/home", (req, res) => {
        res.render("home");
    });

    // Register User
    app.post("/signup", async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        const isAdmin = (username.toLowerCase() === 'yersultan');

        // Check if the username already exists in the database
        const existingUser = await collection.findOne({ name: username });

        if (existingUser) {
            res.send('User already exists. Please choose a different username.');
        } else {
            try {
                // Create a new document to be inserted
                const newUser = new collection({
                    userID: generateUserID(), // Implement a function to generate unique user IDs
                    name: username,
                    password: password,
                    isAdmin: isAdmin
                });

                // Save the new user to the database
                const userdata = await newUser.save();
                console.log(userdata);
                res.render("home");
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        }});

    // Login user
    app.post("/login", async (req, res) => {
        try {
            const check = await collection.findOne({ name: req.body.username });
            if (!check) {
                res.send("User name cannot be found");
            } else if (check.password !== req.body.password) {
                res.send("Wrong Password");
            } else {
                // Set the user information in the session
                req.session.user = {
                    name: check.name,
                    isAdmin: check.isAdmin
                };

                // Redirect based on admin status
                if (check.isAdmin) {
                    res.redirect("/admin");
                } else {
                    res.redirect("/home");
                }
            }
        } catch {
            res.send("Wrong Details");
        }
    });

    // Inside the /admin route
    app.get("/admin", async (req, res) => {
        // Check if the user is logged in and has admin privileges
        if (req.session.user && req.session.user.isAdmin) {
            // If the user is an admin, fetch all users and render the admin view
            const users = await collection.find();
            res.render("admin", { users, adminName: req.session.user.name });
        } else {
            // If the user is not logged in or not an admin, redirect to the login page
            res.redirect("/");
        }
    });
    // Add user route
    app.post("/admin/add", async (req, res) => {
        const newUsername = req.body.newUsername;
        const newPassword = req.body.newPassword;
        const isAdmin = req.body.isAdmin === 'on';

        // Create a new document to be inserted
        const newUser = new collection({
            userID: generateUserID(),
            name: newUsername,
            password: newPassword,
            isAdmin: isAdmin
        });

        // Save the new user to the database
        await newUser.save();

        // Redirect back to the admin panel
        res.redirect("/admin");
    });

    // Edit user route
    app.get("/admin/edit/:userId", async (req, res) => {
        const userId = req.params.userId;

        // Fetch the user from the database based on the user ID
        const user = await collection.findOne({ userID: userId });

        // Render an edit form with the user data
        res.render("edit", { user });
    });

    // Delete user route
    app.post("/admin/delete/:userId", async (req, res) => {
        const userId = req.params.userId;

        // Delete the user from the database based on the user ID
        await collection.findOneAndDelete({ userID: userId });

        // Redirect back to the admin panel
        res.redirect("/admin");
    });
    // Update user route
    app.post("/admin/update/:userId", async (req, res) => {
        const userId = req.params.userId;
        const newUsername = req.body.newUsername;
        const newPassword = req.body.newPassword;
        const isAdmin = req.body.isAdmin === 'on';

        try {
            // Update the user in the database based on the user ID
            await collection.findOneAndUpdate({ userID: userId }, {
                $set: {
                    name: newUsername,
                    password: newPassword,
                    isAdmin: isAdmin
                }
            });

            // Redirect back to the admin panel
            res.redirect("/admin");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });



    // Function to generate a unique user ID
    function generateUserID() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `user_${timestamp}_${random}`;
    }


    // Route to handle phone validation
    let phoneValidationHistory = [];

    // Route to handle phone validation
    app.post("/phone-validate", async (req, res) => {
        const phoneNumber = req.body.number;
        const countryCode = req.body['country-code'];

        const phoneValidateOptions = {
            method: 'POST',
            url: 'https://neutrinoapi-phone-validate.p.rapidapi.com/phone-validate',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': rapid_api_key,
                'X-RapidAPI-Host': 'neutrinoapi-phone-validate.p.rapidapi.com'
            },
            data: {
                number: phoneNumber,
                'country-code': countryCode
            }
        };

        try {
            const response = await axios.request(phoneValidateOptions);

            // Store the validation results in the MongoDB collection
            const validationResult = new PhoneValidation({
                valid: response.data.valid,
                country: response.data.country,
                location: response.data.location,
                type: response.data['prefix-network'],
                timestamp: new Date().toLocaleString(),
                phoneNumber: phoneNumber,
            });

            await validationResult.save();

            // Display validation results
            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Route to render history page
    app.get("/history", async (req, res) => {
        // Fetch phone validation history from MongoDB
        const phoneValidationHistory = await PhoneValidation.find();

        // Fetch email validation history from MongoDB
        const emailValidationHistory = await EmailValidationResultModel.find();

        res.render("history", { phoneValidationHistory, emailValidationHistory });
    });
    // ... (existing code)


    // Route to handle email validation
    // Route to handle email validation
    app.post("/email-validate", async (req, res) => {
        const email = req.body.email;

        const emailValidateOptions = {
            method: 'POST',
            url: 'https://community-neutrino-email-validate.p.rapidapi.com/email-validate',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': rapid_api_key,
                'X-RapidAPI-Host': 'community-neutrino-email-validate.p.rapidapi.com'
            },
            data: {
                email: email
            }
        };

        try {
            const response = await axios.request(emailValidateOptions);

            // Save the email validation results to MongoDB
            const emailValidationResult = new EmailValidationResultModel({
                email: response.data.email,
                valid: response.data.valid,
                provider: response.data.provider,
                isFreemail: response.data['is-freemail'],
                isDisposable: response.data['is-disposable']
            });

            await emailValidationResult.save();

            // Render email validation results
            res.render("emailValidator", { emailValidationResult });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Add this route to render the emailValidator page with an empty emailValidationResult
    app.get("/email-validator", (req, res) => {
        res.render("emailValidator", { emailValidationResult: {} });
    });

    // Define Port for Application
    const port = 3000;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });