import axios from 'axios'
import PropTypes from 'prop-types'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  setAccessPointStatus,
  updateAccessPoint,
  updateAccessPointMeasurements
} from '../store/features/dashboadSlice'
import { selectUserToken } from '../store/store'
import { catchHandler } from '../utils/functions'
import { API_URL, serverEvents } from '../utils/exports'
import { setAlertStatus, setAlerts } from '../store/features/alertsSlice'

import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'

const SocketDashboardWrapper = (props) => {
  const toast = useRef(null)
  const dispatch = useDispatch()

  const [socket, setSocket] = useState(null)

  const token = useSelector(selectUserToken)
  const isLogged = useSelector((state) => state.auth.state)

  const markAlert = (id) => {
    axios.get(`${API_URL}/alerts/acknowledge/${id}`,
      { headers: { 'x-access-token': token } }).then((res) => {
        dispatch(setAlertStatus(id))
      }).catch((err) => {
        catchHandler(err, toast)
      })
  }

  useEffect(() => {
    let newSocket;
    if (isLogged) {
      newSocket = io(API_URL, {
        transports: ['websocket'],
        extraHeaders: {
          'x-auth-token': token
        }
      })


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
                <Acknowledge id={data.alert_id} handleClick={markAlert} />
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
      <Toast ref={toast} onHide={(data) => console.log(data)} />
      {props.children}
    </>
  )
}

SocketDashboardWrapper.propTypes = {
  children: PropTypes.node
}

export default SocketDashboardWrapper

const Acknowledge = ({ id, handleClick }) => {
  const [clicked, setClicked] = useState(false)
  return (
    <Button
      size="small"
      link
      label={clicked ? "" : "Acknowledge"}
      onClick={() => {
        handleClick(id)
        setClicked(true)
      }}
      icon={clicked ? "pi pi-check" : ""}
      disabled={clicked}
    />
  )
}
