const AuthEntity = require("../models/AuthEntity");


async function  getUser (query) {
    try {
        const user = AuthEntity.findOne(query)
        return  user
    } catch (error) {
        console.log(`Could not fetch users ${error}`)
    }
}

async function  getUsers () {
    try {
        const users = AuthEntity.find()
        return  users
    } catch (error) {
        console.log(`Could not fetch users ${error}`)
    }
}

async function  getUserGroupes (googleId) {
    try {
        const user = await AuthEntity.findOne({googleId: googleId})
        return  user.groups
    } catch (error) {
        console.log(`Could not fetch user ${error}`)
    }
}


async function  insertUser (user) {
    try {
        const newUser = new AuthEntity(user)
        const res = await newUser.save();
        return  res
    } catch (error) {
        console.log(`Could not fetch user ${error}`)
    }
}

async function  addNewGroup (googleId, groupId) {
    try {
        const user = await AuthEntity.findOneAndUpdate(
            { googleId: googleId }, 
            { $push: { groups: groupId  } },
          )
        return  user
    } catch (error) {
        console.log(`Could not fetch user ${error}`)
    }
}

async function  removeGroup (googleId, groupId) {
    try {
        const user = await AuthEntity.updateOne(
            { googleId: googleId }, 
            { $pull: { groups: groupId  } },
          )
        return  user
    } catch (error) {
        console.log(`Could not fetch user ${error}`)
    }
}




exports.getUser = getUser;
exports.getUsers = getUsers;
exports.insertUser = insertUser;
exports.addNewGroup = addNewGroup;
exports.getUserGroupes = getUserGroupes;
exports.removeGroup = removeGroup;
