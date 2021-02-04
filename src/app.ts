import http from 'http'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import debug from 'debug'
import express from 'express'
import logger from 'morgan'
import passport from 'passport'
import { PeerServer } from 'peer'
import { Server } from 'socket.io'
import type { Socket } from 'socket.io'
import {
  ENDPOINT_PATH,
  ENDPOINT_VERSION
  ,
  RECEIVE_MESSAGE,
  SEND_MESSAGE
} from './constants'
import { normalizePort } from './helper'
import indexRouter from './routes/index'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*' }
})
const peerServer = PeerServer({
  port: 9000,
  path: '/p2p'
})
const deg = debug('chat-back:server')
const port = normalizePort(process.env.PORT || '3000')
const ENDPOINT = '/'.concat(ENDPOINT_PATH, '/', ENDPOINT_VERSION)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())

app.use(express.static(path.join(__dirname, '../public')))
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

app.use(ENDPOINT.concat('/'), indexRouter)

app.set('port', port)

const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port
  deg('Listening on ' + bind)
}

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// socket.io
io.on('connection', (socket: Socket) => {
  socket.broadcast.emit(RECEIVE_MESSAGE, '新しいユーザーが参加しました！')

  socket.on(SEND_MESSAGE, (message: string) => {
    socket.broadcast.emit(RECEIVE_MESSAGE, message)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit(RECEIVE_MESSAGE, 'ユーザーが退室しました！')
  })
})

// peer
const keys: any = []

peerServer.on('connection', client => {
  const key = client.getId()

  keys.push(key)

  io.emit('keys', keys)
})

peerServer.on('disconnect', client => {
  const key = client.getId()
  const index = keys.indexOf(key)

  if (index > -1) {
    keys.splice(index, 1)
  }

  io.emit('keys', keys)
})
