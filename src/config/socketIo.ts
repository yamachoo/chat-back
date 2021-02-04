import type {
  Server,
  Socket
} from 'socket.io'
import {
  RECEIVE_MESSAGE,
  SEND_MESSAGE
} from '../constants'

export const setupSocketIO = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.broadcast.emit(RECEIVE_MESSAGE, '新しいユーザーが参加しました！')

    socket.on(SEND_MESSAGE, (message: string) => {
      socket.broadcast.emit(RECEIVE_MESSAGE, message)
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit(RECEIVE_MESSAGE, 'ユーザーが退室しました！')
    })
  })
}
