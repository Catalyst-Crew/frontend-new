import PropTypes from 'prop-types'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { API_URL } from '../utils/exports'

const SocketDashboardWrapper = (props) => {
  const [socket, setSocket] = useState(null)

  const isLogged = useSelector((state) => state.auth.state)

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
