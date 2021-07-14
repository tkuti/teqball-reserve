import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

function Groups({ user, getToken }) {
  const [groups, setGroups] = useState()
  const [response, setResponse] = useState()

  useEffect(() => {
    axios
      .post("http://localhost:5000/api/groups/othergroups", { google: user.google }, getToken())
      .then(resp => setGroups(resp.data))
  }, [response])

  const updateMembers = (groupId) => {
    axios
      .post("http://localhost:5000/api/groups/insert-member", { ...user, groupId: groupId }, getToken())
      .then(res => {
        setResponse("Check your email.")
        setTimeout(() => {
          setResponse("")
        }, 3000)
      })
  }

  return (
    <div className="groups-container">
      <h2>Groups</h2>

      <div className="groups">
        {response && <p>{response}</p>}

        {
          groups &&
          groups.map((group) =>
            <div key={uuidv4()} className="group">
              <h3>{group.name}</h3>

              <p className="members-tag">Members:</p>
              <div>
                {
                  group.members.map((member) =>
                    <div key={uuidv4()} className="member">
                      <img src={member.picture} alt="profile" className="profile-picture" />
                      <p>{member.name}</p>
                      <p>{member.groupRole}</p>
                    </div>
                  )
                }
              </div>

              <div>
                <button onClick={() => updateMembers(group._id)}>Join</button>
              </div>
            </div>)
        }
      </div>
    </div>
  )
}

export default Groups
