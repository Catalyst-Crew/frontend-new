import PropTypes from 'prop-types'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { API_URL, serverEvents } from '../utils/exports'
import {
  setAccessPointStatus,
  updateAccessPoint,
  updateAccessPointMeasurements
} from '../store/features/dashboadSlice'

const SocketDashboardWrapper = (props) => {
  const dispatch = useDispatch()

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

    newSocket.on(serverEvents.ACCESS_POINT, (data) => {
      dispatch(setAccessPointStatus({ access_point_status: data.status, access_point_id: data.id }))
    })

    newSocket.on(serverEvents.ACCESS_POINT_FULL, (data) => {
      console.log(data)
      dispatch(updateAccessPoint(data))
    })
    newSocket.on(serverEvents.NEW_MEASUREMENT, (data) => {
      console.log(data)
      dispatch(updateAccessPointMeasurements(data))
    })

    // newSocket.on('message', (newMessage) => {
    //   console.log(newMessage)
    // })

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
