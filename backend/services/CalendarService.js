const { google } = require('googleapis');
const {oAuth2Client} = require('../GoogleSetup')

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

async function createGoogleCalendarGroup (name, refresh_token) {

    oAuth2Client.setCredentials({ refresh_token: refresh_token })

    const newCalendar = {
        summary: name
    }

    try {

        const calendarGroup = await calendar.calendars.insert(
                {
                    auth: oAuth2Client,
                    resource: newCalendar
                }
            )
        
    const calendarId = calendarGroup.data.id

    return calendarId

    } catch (error) {
        console.log("create a group calendar error: " + error)
    }

}

async function quitGroupUpdateAttendees (calendarId, refresh_token, removeMemberEmail) {

    oAuth2Client.setCredentials({ refresh_token: refresh_token })

    const events = await calendar.events.list({
        calendarId: calendarId,
        timeMin: (new Date()).toISOString()
    })

    const eventsArr = events.data.items

    const updatedAllEvents = async (eventsArr) => {

        await asyncForEach(eventsArr, async (event) => {
            await updateCalendarEvent(event)
        })

        // console.log("az összes események frissítve");
    }

    const asyncForEach = async (eventsArr, callback) => {
        for (let index = 0; index < eventsArr.length; index++) {
            await callback(eventsArr[index], index, eventsArr);
        }
    }


    const updateCalendarEvent = async (event) => {

        let attendees = event.attendees
        attendees = attendees.filter(attendee => {
            return attendee.email !== removeMemberEmail
        })

        const newMails = {
            attendees: attendees
        };


        await calendar.events.patch({
            auth: oAuth2Client,
            calendarId: calendarId,
            eventId: event.id,
            sendUpdates: "all",
            resource: newMails
        })

        // console.log("esemény frissítve")

    }

    updatedAllEvents(eventsArr)

}


async function removeMemberFromCalendarGroup (calendarId, email, refresh_token) {

    oAuth2Client.setCredentials({ refresh_token: refresh_token })

// törlöm a felhasználótól a megosztott naptárat, ezután ápdételnem kell az események résztvevőit
    await calendar.acl.delete({
        auth: oAuth2Client,
        calendarId: calendarId,
        ruleId: `user:${email}`
    });

    quitGroupUpdateAttendees(calendarId, refresh_token, email)

}

async function updateAttendees (calendarId, refresh_token, newMember) {

    oAuth2Client.setCredentials({ refresh_token: refresh_token })

    const events = await calendar.events.list({
        calendarId: calendarId,
        timeMin: (new Date()).toISOString()
    })

    const eventsArr = events.data.items

    const updatedAllEvents = async (eventsArr) => {

        await asyncForEach(eventsArr, async (event) => {
            await updateCalendarEvent(event)
        })

        // console.log("az összes események frissítve");
    }

    const asyncForEach = async (eventsArr, callback) => {
        for (let index = 0; index < eventsArr.length; index++) {
            await callback(eventsArr[index], index, eventsArr);
        }
    }


    const updateCalendarEvent = async (event) => {

        let attendees = event.attendees
        attendees.push(newMember)
        // console.log(newMember.email)

        const addNewMember = {
            role: "writer",
            scope: {
                type: "user",
                value: newMember.email
            }
        }

        await calendar.acl.insert(
            {
              auth: oAuth2Client,
              calendarId: calendarId,
              resource: addNewMember
            }
        )

        const newMails = {
            attendees: attendees
        };

        await calendar.events.patch({
            auth: oAuth2Client,
            calendarId: calendarId,
            eventId: event.id,
            sendUpdates: "all",
            resource: newMails
        })

        // console.log("esemény frissítve")

    }

    updatedAllEvents(eventsArr)

}

async function addMemberForCalendarGroup (refresh_token, email, calendarId, group ) {

    const newMember = {
        email: email,
        responseStatus: "needsAction"
    }

    updateAttendees(calendarId, refresh_token, newMember)

}

async function createGoogleEvent (eventData, calendarId) {

    const { title, description, date, end, members, venue } = eventData.event
    
    oAuth2Client.setCredentials({ refresh_token: eventData.refresh_token })

    const attendees = members.map(member => {
        return { 
            email: member.email,
            responseStatus: "needsAction"
        }
    })

    const startDate = date + ":00+02:00"
    const endDate = end + ":00+02:00"

    const newEvent = {
        summary: title,
        description: description,
        start: {
            dateTime: startDate,
        },
        end: {
            dateTime: endDate,
        },
        attendees: attendees,
        location: venue,
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 60 },
                { method: 'popup', minutes: 30 },
            ],
        }
    }

    try {
        
        const newCalendarEvent = await calendar.events.insert({
            auth: oAuth2Client,
            sendUpdates: "all",
            calendarId: calendarId,
            resource: newEvent,
        })

        return newCalendarEvent

    } catch (error) {

        console.log("Calendar create event error: " + error)
        
    }    
    
}

async function updateResponseStatus (userData, calendarId, members, refresh_token) {

    const { calendarEventId, participation } = userData

    // console.log(userData)
    // console.log(members)


    oAuth2Client.setCredentials({ refresh_token: refresh_token })

    const attendees = members.map(member => {
        
        if(member.googleId === userData.member.googleId){
            if(participation === "accepted"){

                return {
                    responseStatus: "accepted",
                    email: member.email
                }
                
            } else if (participation === "denied"){

                return {
                    responseStatus: "declined",
                    email: member.email
                }

            } else {

                return {
                    responseStatus: "needsAction",
                    email: member.email
                }

            }

        } else {
            if(member.participation === ""){

                return {
                        responseStatus: "needsAction",
                        email: member.email
                    }

            }else if (member.participation === "accepted"){

                return {
                        responseStatus: "accepted",
                        email: member.email
                    }

            }else if (member.participation === "denied"){

                return {
                    responseStatus: "declined",
                    email: member.email
                }

            }
        }
    })

    const newResponseStatus = {
        attendees: attendees
    }

 
    try {
        await calendar.events.patch({
            auth: oAuth2Client,
            calendarId: calendarId,
            eventId: calendarEventId,
            resource: newResponseStatus,
        })
        
    } catch (error) {
        console.log("patch error: " + error)
    }

}
    
exports.createGoogleCalendarGroup = createGoogleCalendarGroup;
exports.removeMemberFromCalendarGroup = removeMemberFromCalendarGroup;
exports.updateAttendees = updateAttendees;
exports.addMemberForCalendarGroup = addMemberForCalendarGroup;
exports.createGoogleEvent = createGoogleEvent;
exports.updateResponseStatus = updateResponseStatus;
