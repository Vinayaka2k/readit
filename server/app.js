const express = require('express')
require('express-async-errors')
const cors = require('cors')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const postRouter = require('./controllers/posts')
const signupRouter = require('./controllers/signup')
const loginRouter = require('./controllers/login')

const app = express()

mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error while connecting to MongoDB: ', error.message))

app.use(express.static('build'))
app.use(cors())
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({limit: '10mb', extended: true}))

app.use('/api/entries', postRouter)
app.use('/api/signup', signupRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpointHandler)
app.use(middleware.errorHandler)

module.exports = app