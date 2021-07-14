require("dotenv").config()
const { google } = require('googleapis');

const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
];

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT, process.env.GOOGLE_SECRET, process.env.GOOGLE_REDIRECT
);


exports.oAuth2Client = oAuth2Client
exports.SCOPES = SCOPES