require("dotenv").config()
const GroupService = require("../services/GroupService");
const AuthEntityService = require("../services/AuthEntityService");
const EventService = require("../services/EventService");
const { google } = require('googleapis');
const {oAuth2Client} = require('../GoogleSetup')
const CalendarService = require('../services/CalendarService')


async function getGroups(req, res) {
    try {
        const groups = await GroupService.getGroups()
        if (!groups) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        res.json(groups)
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

async function getMyGroups(req, res) {
    try {
        const googleId = req.body.google
        const groups = await AuthEntityService.getUserGroupes(googleId)
        if (groups.length === 0) {
            res.json([])
        } else {
            const myGroups = await GroupService.getMyGroups(groups)
            if (!myGroups) {
                res.status(400).json({
                    msg: 'Something went wrong!',
                })
            }
            res.json(myGroups)
        }
    } catch (error) {
        res.status(500).json({ error: error })
    }

}
async function getOtherGroups(req, res) {
    try {
        const googleId = req.body.google
        const myGroups = await AuthEntityService.getUserGroupes(googleId)
        const otherGroups = await GroupService.getOtherGroups(myGroups)
        if (!otherGroups) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        res.json(otherGroups)
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function insertGroup(req, res) {
    try {
        const newGroup = req.body
        const refresh_token = newGroup.refresh_token

        const calendarId = await CalendarService.createGoogleCalendarGroup(newGroup.name, refresh_token)

        const groupToInsert = { ...newGroup, calendarId }
        const group = await GroupService.insertGroup(groupToInsert)
        if (!group) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        const googleId = group.members[0].googleId
        const groupId = group._id
        const updatedUser = await AuthEntityService.addNewGroup(googleId, groupId)

        res.json({ msg: "New group successfully created!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function quitGroup(req, res) {
    try {
        const groupId = req.body.groupId
        const googleId = req.body.googleId

        const group = await GroupService.deleteGroupMember(groupId, googleId)
        
        if (!group) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }

        const updatedUser = await AuthEntityService.removeGroup(googleId, groupId)
        
        const updateEvents = await EventService.removeMember(groupId, googleId)

        await CalendarService.removeMemberFromCalendarGroup(group.groupForCalendar.calendarId, req.body.email,  group.groupForCalendar.refresh_token)
        
        // const attendees  = group.groupForCalendar.members.map(member => {
        //     return {email: member.email}
        // })

        // await CalendarService.updateAttendees(attendees, group.groupForCalendar.calendarId, group.groupForCalendar.refresh_token)

        res.json({ msg: "Update was successful." })
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

async function insertMember(req, res) {
    try {
        const data = req.body
        const group = await GroupService.insertMember(data)

        if (!data) {
            res.status(400).json({
                msg: 'Something went wrong!',
            })
        }
        const updatedUser = await AuthEntityService.addNewGroup(data.google, data.groupId)

        const newMember = {
            googleId: data.google,
            name: data.name,
            email: data.email,
            picture: data.picture,
            participation: ""
        }

        const mydata = await EventService.insertMember(data.groupId, newMember)
        

        const teamCalendar = await CalendarService.addMemberForCalendarGroup(group.refresh_token, data.email, group.calendarId, group)

        res.json({ msg: "Group successfully updated!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}


async function updateMemberRole(req, res) {
    try {
        const { groupId, googleId, groupRole } = req.body
        await GroupService.updateMemberRole(groupId, googleId, groupRole)
        res.json({ msg: "Group successfully updated!" })
    } catch (error) {
        res.status(500).json({ error: error })
    }

}



exports.getGroups = getGroups;
exports.insertGroup = insertGroup;
exports.getMyGroups = getMyGroups;
exports.getOtherGroups = getOtherGroups;
exports.quitGroup = quitGroup;
exports.insertMember = insertMember;
exports.updateMemberRole = updateMemberRole;


