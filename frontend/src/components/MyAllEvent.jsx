import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Event from './Event'

function MyAllEvent({ user, getToken }) {
  const [events, setEvents] = useState()
  const [participationResponse, setParticipationResponse] = useState()

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/events/byId/${user.google}`, getToken())
      .then(res => setEvents(res.data))
  }, [participationResponse])

  return (
    <div>
      <h2>My events</h2>

      <div className="my-events">
        {
          events &&
          events.sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((event, i) =>
              <Event key={uuidv4()} event={event} user={user} setParticipationResponse={setParticipationResponse} />
            )
        }
      </div>
    </div>
  )
}

export default MyAllEvent
