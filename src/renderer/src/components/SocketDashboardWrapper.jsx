import PropTypes from 'prop-types'
import { io } from 'socket.io-client'
import { API_URL } from '../utils/exports'
import { useEffect, useState } from 'react'

const SocketDashboardWrapper = (props) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io(API_URL, {
      transports: ['websocket'],
      extraHeaders: {
        'x-auth-token': localStorage.getItem('token')
      }
    })

    setSocket(socket)

    newSocket.on('message', (newMessage) => {
      console.log(newMessage)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])
  return <>{props.children}</>
}

SocketDashboardWrapper.propTypes = {
  children: PropTypes.node
}

export default SocketDashboardWrapper
