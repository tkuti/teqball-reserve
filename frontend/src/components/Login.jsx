import React, { useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

function Login({ checkToken }) {
  let history = useHistory()

  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')

    axios
      .post("http://localhost:5000/api/login/check", { code })
      .then((res) => {
        localStorage.setItem('token', res.data.token)
        history.push("/home");
        checkToken()
      })
      .catch(error => console.log(error))
  }, [])

  return (
    <div className="login">
      <h1>Loading...</h1>
    </div>
  )
}

export default Login
