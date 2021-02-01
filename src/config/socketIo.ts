import type {
  Server,
  Socket
} from 'socket.io'

export const setupSocketIO = (io: Server) => {
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
