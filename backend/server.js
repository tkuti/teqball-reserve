require("dotenv").config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const url = process.env.URL
const loginRouter = require('./routes/LoginRoutes')
const authEntityRoutes = require('./routes/AuthEntityRoutes')
const groupRoutes = require('./routes/GroupRoutes')
const eventRoutes = require('./routes/EventRoutes')

const mongoose = require('mongoose');

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.use(cors())
app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/users', authEntityRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/events', eventRoutes)



app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) }
)