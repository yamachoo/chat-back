import type http from 'http'
import type { Socket } from 'socket.io'
import { Server } from 'socket.io'

export function createSocketIO (server: http.Server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  })

  io.on('connection', (socket: Socket) => {
    socket.broadcast.emit('chat message', '新しいユーザーが参加しました！')

    socket.on('chat message', (message: string) => {
      socket.broadcast.emit('chat message', message)
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('chat message', 'ユーザーが退室しました！')
    })
  })
}
