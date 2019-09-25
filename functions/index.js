const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const sessionsApi = require('./api/Sessions');

// Create API endpoint using express
const app = express();
app.use(cors({origin: true}));
app.disable('x-powered-by');

// Register the api endpoints
app.use('/session', sessionsApi);

// Send 404 for any other request
app.get("*", (req, res) => {
	res.status(404).send("This route does not exist.");
});

exports.api = functions.https.onRequest(app);
