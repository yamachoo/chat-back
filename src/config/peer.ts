import type { CustomExpress } from 'peer'
import type { Server } from 'socket.io'

const keys: any = []

export const setupPeerServer = (peerServer: CustomExpress, io: Server) => {
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
}
