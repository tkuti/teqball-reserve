import React from 'react'
import { Link } from 'react-router-dom'

function Home({ setUser, user }) {
  const logout = () => {
    localStorage.removeItem("token")
    setUser("")
  }

  const googleSignIn = async () => {
    const response = await fetch("http://localhost:5000/api/login")
    const serverResponse = await response.json()

    window.location.href = serverResponse.url
  }

  return (
    <div className="header">
      <img id="logo" src="./img/Teqball_bp_logo.png" alt="Teqball_bp_logo" />

      <div className="header-links">
        {
          user
            ? <>
              <button>
                <Link className="header-button-link" to='/home'>
                  Home
                </Link>
              </button>

              <button>
                <Link className="header-button-link" to='/groups'>
                  Groups
                </Link>
              </button>

              <button>
                <Link className="header-button-link" to='/my-groups'>
                  My groups
                </Link>
              </button>

              <button>
                <Link className="header-button-link" to='/my-all-event'>
                  My all event
                </Link>
              </button>

              <button onClick={logout}>
                <Link className="header-button-link" to='/home'>
                  Logout
                </Link>
              </button>

              <span className="header-button-link">Hi, {user.name}</span>
            </>
            : <>
              <button>
                <Link className="header-button-link" to='/home'>
                  Home
                </Link>
              </button>

              <button className="header-button-link" onClick={googleSignIn}>
                Login
              </button>
            </>
        }
      </div>

      <p id="copyright">© T4 team, 2021</p>
    </div>
  )
}

export default Home
