import React, { useState } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import GoogleMap from './GoogleMap'

function Event({ event, user, setParticipationResponse, getToken }) {
  const [isShowMore, setIsShowMore] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const saveParticipation = (e) => {
    const participation = e.target.value

    axios
      .post("http://localhost:5000/api/events/update-participation", {
        eventId: event._id,
        calendarEventId: event.calendarEventId,
        groupId: event.groupId,
        participation: participation,
        member: {
          googleId: user.google,
          name: user.name,
          picture: user.picture
        }
      }, getToken())
      .then(res => setParticipationResponse(res.data))
  }

  const checkDefaultValue = (value) => {
    const actualUser = event.members.find(member => member.googleId === user.google)

    if (actualUser?.participation === value) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className="event" key={event._id}>
      <div className="basic-info">
        <p>{event.title}</p>

        <div className="map-container">
          <p>{event.venue}</p>
          <button onClick={() => setShowMap(true)}>Show in map</button>
        </div>

        {showMap && <GoogleMap setShowMap={setShowMap} venue={event.venue} />}
        <p>{event.date.slice(0, 10)} {event.date.slice(11, 16)}</p>

        <div className="accepted-denied-dunno-container">
          <label htmlFor="accept">Accept: </label>
          <input type="radio" value="accepted" name={event._id} id="accept" onChange={saveParticipation} defaultChecked={checkDefaultValue("accepted")} />

          <label htmlFor="deny">Deny: </label>
          <input type="radio" value="denied" name={event._id} id="deny" onChange={saveParticipation} defaultChecked={checkDefaultValue("denied")} />

          <label htmlFor="dunno">I dont know: </label>
          <input type="radio" value="" name={event._id} id="dunno" onChange={saveParticipation} defaultChecked={checkDefaultValue("")} />
        </div>

        <button className="show-more-less-button" onClick={() => setIsShowMore(!isShowMore)}>
          {isShowMore ? "Show less" : "Show more"}
        </button>
      </div>

      {
        isShowMore &&
        <div className="details">
          <div>
            <p>Description: {event.description}</p>
          </div>

          <p>Accepted: </p>
          {
            event.members.filter(member => member.participation === "accepted")
              .map(member =>
                <div key={uuidv4()} className="member">
                  <img src={member.picture} alt="profile" className="profile-picture" />
                  <p>{member.name}</p>
                </div>
              )
          }

          <p>Denied: </p>
          {
            event.members.filter(member => member.participation === "denied")
              .map(member =>
                <div key={uuidv4()} className="member">
                  <img src={member.picture} alt="profile" className="profile-picture" />
                  <p>{member.name}</p>
                </div>
              )
          }
        </div>
      }
    </div>
  )
}

export default Event
