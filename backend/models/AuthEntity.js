const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const authEntitySchema = Schema({

    name:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
    },

    googleId:{
        type: String,
        required: true,
    },

    groups: [String],

    picture: {
        type: String,
        required: true,
    }

});


module.exports = AuthEntity = mongoose.model("AuthEntity", authEntitySchema, "authEntities");