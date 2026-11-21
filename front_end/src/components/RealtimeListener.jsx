import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useToast from '../utils/useToast.js'
import Toast from './common_components/Toast.jsx'
import socket, { reconnectSocket } from '../socket/socketClient.js'
import { registerSocketHandlers } from '../socket/socketHandlers.js'

function RealtimeListener() {
    const userId = useSelector(state => state.auth.userData?._id)
    const { toast, toastVisible, showToast, dismissToast } = useToast()

    // Listeners are registered once. showToast only calls state setters, which are stable.
    useEffect(() => {
        const cleanup = registerSocketHandlers(socket, showToast)
        return cleanup
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Connect, and reconnect whenever identity changes: guest -> user, user -> guest, A -> B
    useEffect(() => {
        reconnectSocket()
        return () => { socket.disconnect() }
    }, [userId])

    return <Toast toast={toast} toastVisible={toastVisible} dismissToast={dismissToast} />
}

export default RealtimeListener