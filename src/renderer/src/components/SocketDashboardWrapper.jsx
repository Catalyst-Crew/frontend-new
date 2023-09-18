import PropTypes from 'prop-types'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  setAccessPointStatus,
  updateAccessPoint,
  updateAccessPointMeasurements
} from '../store/features/dashboadSlice'
import { API_URL, serverEvents } from '../utils/exports'

import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { setAlertStatus, setAlerts } from '../store/features/alertsSlice'

const SocketDashboardWrapper = (props) => {
  const toast = useRef(null)
  const dispatch = useDispatch()

  const [socket, setSocket] = useState(null)

  const isLogged = useSelector((state) => state.auth.state)

  const markAlert = (id) => {
    dispatch(setAlertStatus(id))
  }

  useEffect(() => {
    const newSocket = io(API_URL, {
      transports: ['websocket'],
      extraHeaders: {
        'x-auth-token': localStorage.getItem('token')
      }
    })

    if (isLogged) {
      setSocket(socket)

      newSocket.on(serverEvents.ACCESS_POINT, (data) => {
        dispatch(
          setAccessPointStatus({ access_point_status: data.status, access_point_id: data.id })
        )
      })

      newSocket.on(serverEvents.ACCESS_POINT_FULL, (data) => {
        dispatch(updateAccessPoint(data))
      })
      newSocket.on(serverEvents.NEW_MEASUREMENT, (data) => {
        dispatch(updateAccessPointMeasurements(data))
      })

      newSocket.on(serverEvents.NEW_ALERT, (data) => {
        dispatch(setAlerts(data))
        toast.current.show({
          sticky: true,
          life: 200_000,
          severity: 'error',
          summary: 'New Panic Alert',
          content: (
            <div>
              <table>
                <tbody>
                  <tr>
                    <th>Miner Name:</th>
                    <td>{data.miner_name}</td>
                  </tr>
                  <tr>
                    <th>Area Name:</th>
                    <td>{data.area_name}</td>
                  </tr>
                  <tr>
                    <th>Access-Point Name:</th>
                    <td>{data.access_point_name}</td>
                  </tr>
                  <tr>
                    <th>Other Data:</th>
                    <td>{JSON.stringify(data.measurement_other_data)}</td>
                  </tr>
                </tbody>
              </table>
              <div>
                <Button
                  size="small"
                  link
                  label="Mark Resolved"
                  onClick={() => markAlert(data.alert_id)}
                />
              </div>
            </div>
          )
        })
      })
    }

    return () => {
      newSocket.disconnect()
    }
  }, [isLogged])

  return (
    <>
      <Toast ref={toast} />
      {props.children}
    </>
  )
}

SocketDashboardWrapper.propTypes = {
  children: PropTypes.node
}

export default SocketDashboardWrapper
