import axios from 'axios'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { OverlayPanel } from 'primereact/overlaypanel'

import MyMap from '../../components/Map'
import audio from '../../assets/audio.wav'
import Navbar from '../../components/Navbar'
import { API_URL } from '../../utils/exports'
import DateTime from '../../components/DateTime'
import Announcements from '../../components/Announcements'
import EmergencyAlert from '../../components/EmergencyAlert'

import { catchHandler } from '../../utils/functions'
import { setAlertsOff } from '../../store/features/alertsSlice'
import {
  setDashboardData,
  setFocusedAccesspoint,
  setSeenAnnouncements,
  turnOffEmergencies
} from '../../store/features/dashboadSlice'
import {
  selectAreas,
  selectUserToken,
  selectAlertsCount,
  selectAccessPoints,
  selectAnnouncements
} from '../../store/store'
import MinerSearch from '../../components/MinerSearch'

const Dashbord = () => {
  const op = useRef(null)
  const toastRef = useRef(null)
  const dispatch = useDispatch()
  const navigator = useNavigate()
  const { load, pause, play } = useGlobalAudioPlayer()

  const [zoom, setZoom] = useState(16.2)
  const [color, setColor] = useState('info')
  const [search, setSearch] = useState(false)
  const [showAnn, setShowAnn] = useState(true)
  const [intervalTime, setIntervalTime] = useState(10_000)
  const [center, setCenter] = useState([-26.260693, 29.121075])
  const [next, setNext] = useState({ area: 0, miner: 0, accessPoint: 0 })

  const areas = useSelector(selectAreas)
  const [plays, setPlay] = useState(true)
  const ann = useSelector(selectAnnouncements)
  const userToken = useSelector(selectUserToken)
  const alertCount = useSelector(selectAlertsCount)
  const accessPoints = useSelector(selectAccessPoints)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (localStorage.getItem('audio_alerts')) {
      setPlay(JSON.parse(localStorage.getItem('audio_alerts')))
    }
    load(audio, { loop: true, html5: true })

    const intvlTime = localStorage.getItem('intervalTime')
      ? JSON.parse(localStorage.getItem('intervalTime'))
      : 3_000

    setIntervalTime(intvlTime)
  }, [color])

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkResponseTime(API_URL)
    }, intervalTime)
    return () => {
      clearInterval(intervalId)
    }
  }, [intervalTime])

  const fetchDashboardData = () => {
    axios
      .get(`${API_URL}/dashboard`, { headers: { 'x-access-token': userToken } })
      .then((res) => {
        if (res.status === 200) {
          dispatch(setDashboardData(res.data))
        }
      })
      .catch((err) => {
        catchHandler(err, toastRef)
      })
  }

  const handleNextMiner = () => {
    if (next < accessPoints[next.accessPoint]?.measurements?.length - 1) {
      setNext((prev) => ({ ...prev, miner: prev.miner + 1 }))
    } else {
      setNext((prev) => ({ ...prev, miner: 0 }))
    }
  }

  const handlePrevMiner = () => {
    if (next.miner > 0) {
      setNext((prev) => ({ ...prev, miner: prev.miner - 1 }))
    } else {
      setNext((prev) => ({
        ...prev,
        miner: accessPoints[next.accessPoint]?.measurements?.length - 1
      }))
    }
  }

  const handleNextArea = () => {
    if (next.area < areas.length - 1) {
      setNext((prev) => ({ ...prev, area: prev.area + 1 }))
    } else {
      setNext((prev) => ({ ...prev, area: 0 }))
    }
  }

  const handlePrevArea = () => {
    if (next.area > 0) {
      setNext((prev) => ({ ...prev, area: prev.area - 1 }))
    } else {
      setNext((prev) => ({ ...prev, area: areas.length - 1 }))
    }
  }

  const handleNextAccessPoint = () => {
    if (next.accessPoint < accessPoints.length - 1) {
      setNext((prev) => ({ ...prev, accessPoint: prev.accessPoint + 1 }))
      dispatch(setFocusedAccesspoint(accessPoints[next.accessPoint + 1].access_point_id))
    } else {
      setNext((prev) => ({ ...prev, accessPoint: 0 }))
      dispatch(setFocusedAccesspoint(accessPoints[0].access_point_id))
    }
  }

  const handlePrevAccessPoint = () => {
    if (next.accessPoint > 0) {
      setNext((prev) => ({ ...prev, accessPoint: prev.accessPoint - 1 }))
      dispatch(setFocusedAccesspoint(accessPoints[next.accessPoint - 1].access_point_id))
    } else {
      setNext((prev) => ({ ...prev, accessPoint: accessPoints.length - 1 }))
      dispatch(setFocusedAccesspoint(accessPoints[accessPoints.length - 1].access_point_id))
    }
  }

  async function checkResponseTime(url) {
    const start = Date.now()
    fetch(url)
      .then(() => {
        const end = Date.now()
        const responseTime = end - start

        if (responseTime < 500) {
          setColor('success')
        } else if (responseTime < 5000) {
          setColor('warning')
        }
      })
      .catch(() => {
        if (plays) {
          play()
        }

        setColor('danger')
        catchHandler(
          {
            message:
              'Error pinging the server! Please notify technitians if error persists after 5 min'
          },
          toastRef
        )
      })
  }

  const updateInterval = (time) => {
    setIntervalTime(time)
    localStorage.setItem('intervalTime', JSON.stringify(time))
  }

  const handeShowAnn = () => {
    dispatch(setSeenAnnouncements())
    setShowAnn((prev) => !prev)
  }
  return (
    <div className="max-h-screen max-w-screen overflow-hidden">
      <EmergencyAlert />
      <Navbar activeIndex={0} />
      <Toast ref={toastRef} />

      <div className="grid text-sm" style={{ height: '89vh' }}>
        <div className="col-9 flex flex-column pr-2" style={{ height: '100%' }}>
          {/* Map caontainer */}
          <div className="h-full">
            <div className="border-blue-500 border-solid border-1 border-round-xs h-full w-full">
              <MyMap
                defaultZoom={zoom}
                setZoom={setZoom}
                defaultCenter={center}
                setCenter={setCenter}
                toastRef={toastRef}
              />
            </div>
          </div>

          {/* Footer caontainer */}
          <div className="mt-2">
            <div className="grid m-0">
              <div className="col-4 flex p-0">
                <span className="p-buttonset">
                  <Button className="button" label="Map" />
                  {alertCount ? (
                    <Button
                      className="button"
                      label="Stop Alerts"
                      onClick={() => {
                        dispatch(setAlertsOff())
                        dispatch(turnOffEmergencies())
                      }}
                      badge={alertCount.toString()}
                    />
                  ) : (
                    <Button className="button" label="Stop Alerts" />
                  )}
                  <Button
                    className="button"
                    label="Ann"
                    onClick={handeShowAnn}
                    icon="pi pi-inbox"
                    iconPos="right"
                  />
                </span>
              </div>

              <div className="col-1 p-0 flex align-items-center">
                <Button
                  text
                  size="small"
                  tooltip={`Ping every: ${intervalTime / 1000} sec. Click to change`}
                  tooltipOptions={{ position: 'top' }}
                  onClick={(e) => op.current.toggle(e)}
                >
                  <Badge value="" severity={color} />
                </Button>
              </div>
              <div className="col-3 p-0 flex align-items-center">
                <DateTime format="ddd, MMMM Mo, Y, HH:mm:ss" />
              </div>

              <div className="col-1 flex justify-content-end p-0">
                <Button
                  icon="pi pi-cog"
                  text
                  raised
                  size="small"
                  onClick={() => navigator('/settings')}
                />
              </div>

              <div className="col-3 flex justify-content-end p-0 ">
                <span className="p-buttonset">
                  <Button
                    icon="pi pi-plus"
                    text
                    raised
                    size="small"
                    onClick={() => setZoom(zoom + 0.2 < 20 ? zoom + 0.2 : 20)}
                  />
                  <Button
                    accessKey="Shift + r"
                    icon="pi pi-refresh"
                    text
                    raised
                    size="small"
                    onClick={() => {
                      setZoom(16.2)
                      fetchDashboardData()
                      setCenter([-26.260693, 29.121075])
                    }}
                  />
                  <Button
                    icon="pi pi-minus"
                    text
                    raised
                    size="small"
                    onClick={() => setZoom(zoom - 0.2 > 0 ? zoom - 0.2 : 0.2)}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards caontainer */}
        <div className="col-3 pl-2 line-height-2 flex flex-column gap-2">
          {accessPoints[next.accessPoint]?.measurements?.length > 0 ? (
            <Card
              title={() => (
                <div className="flex justify-content-between align-items-center">
                  <h4 className="p-0 m-0 ">Miner Details</h4>
                  <Button icon="pi pi-search" text onClick={() => setSearch(true)} />
                </div>
              )}
              className="text-sm"
            >
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-left">Miner ID:</td>
                    <td className="font-bold text-right vertical-align-middle">
                      {`min-${
                        accessPoints[next.accessPoint]?.measurements[next.miner]?.miner_id
                      }` || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left">Miner Name:</td>
                    <td className="font-bold text-right vertical-align-middle">
                      {accessPoints[next.accessPoint]?.measurements[next.miner]?.miner_name ||
                        'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left">Shift:</td>
                    <td className="font-bold text-right vertical-align-middle">
                      {accessPoints[next.accessPoint]?.measurements[next.miner]?.shift_name ||
                        'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left">Node ID:</td>
                    <td className="font-bold text-right vertical-align-middle">
                      {`sen-${
                        accessPoints[next.accessPoint]?.measurements[next.miner]?.sensor_id
                      }` || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left">Location:</td>
                    <td className="font-bold text-right vertical-align-middle">
                      {accessPoints[next.accessPoint]?.area_name || 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left">Last Update:</td>
                    <td className="font-bold text-right vertical-align-middle">
                      {moment(
                        accessPoints[next.accessPoint]?.measurements[next.miner]?.created_at ||
                          new Date(2000, 1, 1)
                      ).fromNow()}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-content-between">
                <IconButton
                  icon={'angle-left'}
                  onClick={handlePrevMiner}
                  className="cursor-pointer"
                />
                <IconButton
                  icon={'angle-right'}
                  onClick={handleNextMiner}
                  className="cursor-pointer"
                />
              </div>
            </Card>
          ) : (
            <Card
              title={() => (
                <div className="flex justify-content-between align-items-center">
                  <h4 className="p-0 m-0 ">Miner Details</h4>
                  <Button icon="pi pi-search" text onClick={() => setSearch(true)} />
                </div>
              )}
              className="text-sm"
            >
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-left">Miner ID:</td>
                    <td className="font-bold text-right vertical-align-middle">{'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="text-left">Miner Name:</td>
                    <td className="font-bold text-right vertical-align-middle">{'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="text-left">Shift:</td>
                    <td className="font-bold text-right vertical-align-middle">{'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="text-left">Node ID:</td>
                    <td className="font-bold text-right vertical-align-middle">{'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="text-left">Location:</td>
                    <td className="font-bold text-right vertical-align-middle">{'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="text-left">Last Update:</td>
                    <td className="font-bold text-right vertical-align-middle">{'N/A'}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-content-between">
                <IconButton
                  icon={'angle-left'}
                  onClick={handlePrevMiner}
                  className="cursor-pointer"
                />
                <IconButton
                  icon={'angle-right'}
                  onClick={handleNextMiner}
                  className="cursor-pointer"
                />
              </div>
            </Card>
          )}

          <Card title="Access Point" className="text-sm">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-left w-">ID:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {`acc-${accessPoints[next.accessPoint]?.access_point_id}` || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="text-left w-">Name:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {accessPoints[next.accessPoint]?.access_point_name || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="text-left w-">Nodes:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {accessPoints[next.accessPoint]?.measurements?.length || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">Location:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {accessPoints[next.accessPoint]?.area_name || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">Created:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {moment(
                      accessPoints[next.accessPoint]?.access_point_created_at ||
                        new Date(2000, 1, 1)
                    ).fromNow()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-content-between">
              <IconButton
                icon={'angle-left'}
                onClick={handlePrevAccessPoint}
                className="cursor-pointer"
              />
              <IconButton
                icon={'angle-right'}
                onClick={handleNextAccessPoint}
                className="cursor-pointer"
              />
            </div>
          </Card>

          <Card title="Area Details" className="text-sm">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="text-left">ID:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {`area-${areas[next.area]?.area_id}` || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">Supervisor Name:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {areas[next.area]?.supervisor || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">Nodes:</td>
                  <td className="font-bold text-right vertical-align-middle">22</td>
                </tr>
                <tr>
                  <td className="text-left">Location:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {' '}
                    {`area-${areas[next.area]?.area_name}` || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">Last Update:</td>
                  <td className="font-bold text-right vertical-align-middle">
                    {moment(areas[next.area]?.area_created_at || new Date(2000, 1, 1)).fromNow()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-content-between">
              <IconButton icon={'angle-left'} onClick={handlePrevArea} className="cursor-pointer" />
              <IconButton
                icon={'angle-right'}
                onClick={handleNextArea}
                className="cursor-pointer"
              />
            </div>
          </Card>
        </div>
      </div>

      <OverlayPanel ref={op}>
        <div>
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-100"
            label="3 sec"
            onClick={() => updateInterval(3_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-100"
            label="10 sec"
            onClick={() => updateInterval(10_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-100"
            label="30 sec"
            onClick={() => updateInterval(30_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-100"
            label="1 min"
            onClick={() => updateInterval(60_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-100"
            label="5 min"
            onClick={() => updateInterval(300_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-100"
            label="Stop alert"
            onClick={() => {
              setPlay(false)
              pause()
            }}
          />
        </div>
      </OverlayPanel>

      <Announcements
        visible={showAnn && ann}
        setVisible={handeShowAnn}
        toastRef={toastRef}
        userToken={userToken}
      />

      <MinerSearch show={search} setShow={setSearch} />
    </div>
  )
}

export default Dashbord

const IconButton = ({ icon, onClick, className }) => (
  <i
    aria-label="Filter"
    className={`px-3 py-1 pi pi-${icon} ${className} text-blue-200`}
    size="small"
    onClick={onClick}
  />
)

IconButton.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
}
