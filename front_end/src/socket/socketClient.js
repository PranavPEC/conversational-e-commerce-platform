import { io } from 'socket.io-client'
import { SERVER_URL } from '../utils/APIConfig.js'

// autoConnect:false: we decide when to connect (after auth is known)
const socket = io(SERVER_URL, { withCredentials: true, autoConnect: false })

// A socket's identity is fixed at handshake time. After login/logout the old
// connection still thinks you are the previous user (or a guest), so we must
// reconnect whenever the logged-in user changes.
export const reconnectSocket = () => {
    if (socket.connected) socket.disconnect()
    socket.connect()
}

export default socket