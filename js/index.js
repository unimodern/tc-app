const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const cors = require('cors')({ origin: true });

const Convert = require("./Convert.js");

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.convert = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        // Grab the text parameter.
        const text = req.query.text ? req.query.text:"This is a test."

        const conversion = req.query.conversion ? req.query.conversion:"snakecase";
        const conv = new Convert(text);
        const newcase = conv.convert(conversion);

        // Send back a message that we've successfully written the message
        res.json({ result: newcase });
    });
});

exports.bigben = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const hours = (new Date().getHours() % 12) + 1  // London is UTC + 1hr;
        res.status(200).send(`<!doctype html>
            <head>
            <title>Time</title>
            </head>
            <body>
            ${'-BONG '.repeat(hours)}
            </body>
        </html>`);
    });
});

