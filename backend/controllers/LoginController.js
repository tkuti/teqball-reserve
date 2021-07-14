require("dotenv").config()
const jwt = require('jsonwebtoken');
const AuthEntityService = require("../services/AuthEntityService");
const fetch = require('node-fetch')
const jwt_decode = require("jwt-decode");
const {oAuth2Client, SCOPES} = require('../GoogleSetup')


// const oAuth2Client = new google.auth.OAuth2(
//     "498850833112-nriqbtbfbke2mc1f90s4uvrbk0ehi9g9.apps.googleusercontent.com",
//     "Y5PtJP9KtV-eUm5GtVecUaVw",
//     'http://localhost:3000/login'
// );

async function googleSetup(req, res) {

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: "select_account"
    });

    res.send({ url: authUrl })
}

async function checkingLogin(req, res) {
    const code = req.body.code

    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);

        oAuth2Client.setCredentials({ refresh_token: token.refresh_token });

        checkingUser(token, res)
    });

}

async function checkingUser(token, res) {

    const { name, email, sub, picture } = jwt_decode(token.id_token)

    const foundUser = await AuthEntityService.getUser({ googleId: sub })
    if (!foundUser) {
        const newUser = {
            name: name,
            email: email,
            googleId: sub,
            groups: [],
            picture: picture
        }
        await AuthEntityService.insertUser(newUser)
    }
    jwt.sign({
        "google": sub,
        "name": name,
        "email": email,
        "picture": picture,
        "refresh_token": token.refresh_token
    }, process.env.JWT_SECRET, { expiresIn: '1h' },
        function (err, token) {
            res.json({ token: token })
        });
}



exports.googleSetup = googleSetup;
exports.checkingLogin = checkingLogin;

