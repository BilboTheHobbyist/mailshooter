// 1. Import required modules
const express = require('express');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const validator = require('validator');
const cors = require('cors');
require('dotenv').config();  // Load environment variables

// 2. Initialize Express app
const app = express();

// 3. Enable CORS, dynamically using the FORM_DOMAIN from the .env file
app.use(cors({ origin: process.env.FORM_DOMAIN }));

// 4. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Mailgun setup using environment variables
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
    url: 'https://api.eu.mailgun.net'
});

// 6. Route to handle email sending with input sanitization and validation
app.post('/send', async (req, res) => {
    let { from, subject, message } = req.body;

    // Sanitize input
    from = validator.normalizeEmail(from);
    subject = validator.escape(subject);
    message = validator.escape(message);

    // Validate input
    if (!validator.isEmail(from)) {
        return res.status(400).send('Invalid email format.');
    }
    if (validator.isEmpty(subject) || validator.isEmpty(message)) {
        return res.status(400).send('Subject and message cannot be empty.');
    }

    const emailData = {
        from,
        to: process.env.MAILGUN_TO,
        subject,
        text: message
    };

    try {
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, emailData);
        res.send(`Email successfully sent! Details: ${JSON.stringify(response)}`);
    } catch (error) {
        console.error('Mailgun Error:', error);  // Log error details
        res.status(500).send(`Error: ${error.message}`);
    }
});

// 7. Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});
