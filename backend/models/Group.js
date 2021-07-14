const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const groupSchema = Schema({

    name:{
        type: String,
        required: true,
    },

    creator: {
        type: String,
        required: true,
    },

    refresh_token: {
        type: String,
        required: true,
    },

    calendarId: {
        type: String,
        required: true,
    },

    members: [
        {
            googleId: String,
            name: String,
            email: String,
            groupRole: String,
            picture: String
        }
    ],

    events: [String]
});


module.exports = Group = mongoose.model("Group", groupSchema);