import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import passport from 'passport'

import indexRouter from './routes/index'
import usersRouter from './routes/users'

import {
  ENDPOINT_PATH,
  ENDPOINT_VERSION
} from './constants'

const app = express()
const ENDPOINT = '/'.concat(ENDPOINT_PATH, '/', ENDPOINT_VERSION)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, '../public')))

app.use(ENDPOINT.concat('/'), indexRouter)
app.use(ENDPOINT.concat('/users'), usersRouter)

export default app
