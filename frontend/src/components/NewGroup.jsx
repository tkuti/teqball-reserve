import React, { useState } from 'react'
import axios from 'axios'

function NewGroup({ setIsNewGroup, user, getToken }) {
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const createNewGroup = () => {
    setIsLoading(true)
    const newGroup = {
      name: name,
      creator: user.google,
      members: [
        {
          googleId: user.google,
          name: user.name,
          email: user.email,
          groupRole: "admin",
          picture: user.picture
        }
      ]
    }

    axios
      .post("http://localhost:5000/api/groups", {
        ...newGroup, refresh_token: user.refresh_token
      }, getToken())
      .then((res) => {
        setIsNewGroup(false)
        setIsLoading(false)
      })
      .catch(error => console.log(error))
  }

  return (
    <div>
      <div>
        <label htmlFor="name">Group name: </label>
        <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <button onClick={createNewGroup} disabled={isLoading}>
          Create
        </button>
      </div>
    </div>
  )
}

export default NewGroup
