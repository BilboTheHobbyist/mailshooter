// 1. Import required modules
const express = require('express');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

// 2. Initialize Express app
const app = express();

// 3. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Mailgun setup using environment variables
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
    url: 'https://api.eu.mailgun.net'
});

// 5. Route to serve the HTML form
app.get('/', (req, res) => {
    res.send(`
        <form action="/send" method="POST">
            <label for="from">Your Email:</label>
            <input type="email" id="from" name="from" required><br><br>
            <label for="subject">Subject:</label>
            <input type="text" id="subject" name="subject" required><br><br>
            <label for="message">Message:</label>
            <textarea id="message" name="message" required></textarea><br><br>
            <button type="submit">Send Email</button>
        </form>
    `);
});

// 6. Route to handle email sending
app.post('/send', async (req, res) => {
    const { from, subject, message } = req.body;

    const emailData = {
        from: from,
        to: process.env.MAILGUN_TO,
        subject,
        text: message
    };

    try {
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, emailData);
        res.send(`Email successfully sent! Details: ${JSON.stringify(response)}`);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

// 7. Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});