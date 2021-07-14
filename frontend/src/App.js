import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import './style/style.scss';
import Header from './components/Header'
import Login from './components/Login'
import MyGroups from './components/MyGroups'
import Groups from './components/Groups'
import MyAllEvent from './components/MyAllEvent'
import Homepage from './components/Homepage'

function App() {
  const [user, setUser] = useState("")

  const getToken = () => {
    return {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  }

  const checkToken = () => {
    const token = localStorage.getItem("token")
    if (token) {
      setUser(jwt_decode(token))
    }
  }

  useEffect(() => {
    checkToken()
  }, [])


  return (
    <div className="app">
      <Router>

        <Route path='/' >
          <Header setUser={setUser} user={user} />
        </Route>

        <Switch>
          <Route path='/login'>
            <Login checkToken={checkToken} />
          </Route>

          <Route path='/home'>
            <Homepage />
          </Route>

          <Route path='/groups'>
            {
              user
                ? <Groups user={user} getToken={getToken} />
                : <Redirect to='/home' />
            }
          </Route>

          <Route path='/my-groups'>
            {
              user
                ? <MyGroups user={user} getToken={getToken} />
                : <Redirect to='/home' />
            }
          </Route>

          <Route path='/my-all-event'>
            {
              user
                ? <MyAllEvent user={user} getToken={getToken} />
                : <Redirect to='/home' />
            }
          </Route>
        </Switch>
      </Router >
    </div>
  );
}

export default App;
