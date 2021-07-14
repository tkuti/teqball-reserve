const Group = require("../models/Group");


async function  getGroups () {
    try {
        const groups = Group.find()
        return  groups
    } catch (error) {
        console.log(`Could not fetch groups ${error}`)
    }
}

async function  getGroupById (groupId) {
    // console.log(groupId)
    try {
        const group = Group.findOne({_id: groupId})
        return  group
    } catch (error) {
        console.log(`Could not fetch group ${error}`)
    }
}

async function  getMyGroups (groups) {
    try {
        const query = {
            $or: []
        }
        groups.forEach(group => query.$or.push({_id: group}))
        const mygroups = await Group.find(query)
        return  mygroups
    } catch (error) {
        console.log(`Could not fetch groups ${error}`)
    }
}
async function  getOtherGroups (groups) {
    try {
        if (groups.length === 0) {
            const otherGroups = await Group.find()
            return  otherGroups
        } else {
            const query = {
                $and: []
            }
            groups.forEach(group => query.$and.push({_id: {$ne: group} }))
            const otherGroups = await Group.find(query)
            return  otherGroups
        }
    } catch (error) {
        console.log(`Could not fetch groups ${error}`)
    }
}


async function  insertGroup (group) {
    try {
        const newGroup = new Group(group)
        const res = await newGroup.save();
        return  res
    } catch (error) {
        console.log(`Could not fetch group ${error}`)
    }
}

async function  insertMember (data) {
    try {
        const group = await Group.findOneAndUpdate(
            { _id: data.groupId }, 
            { $push: { members: {
                googleId: data.google,
                name: data.name,
                email: data.email,
                groupRole: "member",
                picture: data.picture
            } } },
          )
        return  group
    } catch (error) {
        console.log(`Could not fetch group ${error}`)
    }
}

async function  deleteGroupMember (groupId, googleId) {
    
    try {
        const group = await Group.updateOne(
            { _id: groupId }, 
            { $pull: { members: { googleId: googleId } } },
          )
// Norbi - kiszedem a calendarid-t a csoportból

        const groupForCalendar = await Group.findOne({_id: groupId})
        const calendarData = {}
        calendarData.calendarId = groupForCalendar.calendarId
        calendarData.refresh_token = groupForCalendar.refresh_token
        console.log(groupForCalendar)
        // return  group
        return  {group, groupForCalendar}
// ---------------------------------------------

    } catch (error) {
        console.log(`Could not fetch group ${error}`)
    }
}

async function  updateMemberRole (groupId, googleId, groupRole ) {
    
    try {
        const updatedGroup = await Group.updateOne(
            {$and: [{_id: groupId}, {'members.googleId': googleId}]}, 
            {$set: {'members.$.groupRole': groupRole }}
          )
        return  updatedGroup
    } catch (error) {
        console.log(`Could not fetch group ${error}`)
    }
}

async function  addNewEvent (groupId, eventId) {
    try {
        const user = await Group.findOneAndUpdate(
            { _id: groupId }, 
            { $push: { events: eventId  } },
          )
        return  user
    } catch (error) {
        console.log(`Could not fetch user ${error}`)
    }
}


exports.getGroups = getGroups;
exports.getGroupById = getGroupById;
exports.insertGroup = insertGroup;
exports.getMyGroups = getMyGroups;
exports.getOtherGroups = getOtherGroups;
exports.insertMember = insertMember;
exports.deleteGroupMember = deleteGroupMember;
exports.updateMemberRole = updateMemberRole;
exports.addNewEvent = addNewEvent;
