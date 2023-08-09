import { useNavigate } from 'react-router'
import { useEffect, useRef, useState } from 'react'

import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { OverlayPanel } from 'primereact/overlaypanel'

import MyMap from '../../components/Map'
import Navbar from '../../components/Navbar'
import { API_URL } from '../../utils/exports'
import DateTime from '../../components/DateTime'

const Dashbord = () => {
  const op = useRef(null)
  const navigator = useNavigate()
  const [zoom, setZoom] = useState(16.2)
  const [color, setColor] = useState('info')
  const [intervalTime, setIntervalTime] = useState(10_000)
  const [center, setCenter] = useState([-26.260693, 29.121075])

  useEffect(() => {
    const intervalTime = JSON.parse(localStorage.getItem('intervalTime'))
    if (intervalTime) {
      setIntervalTime(intervalTime)
    }
    checkResponseTime(API_URL)
    const intervalId = setInterval(() => {
      checkResponseTime(API_URL)
    }, intervalTime)

    return () => {
      clearInterval(intervalId)
    }
  }, [intervalTime])

  async function checkResponseTime(url) {
    try {
      const start = Date.now()
      const server = await fetch(url)
      const end = Date.now()
      const responseTime = end - start

      if (server.status !== 200) {
        throw new Error('Server is down')
      }

      if (responseTime < 500) {
        setColor('success')
      } else if (responseTime < 5000) {
        setColor('warning')
      } else {
        setColor('danger')
      }
    } catch (error) {
      setColor('red')
    }
  }

  const updateInterval = (time) => {
    setIntervalTime(time)
    localStorage.setItem('intervalTime', JSON.stringify(time))
    op.current.hide()
  }

  return (
    <div className="max-h-screen max-w-screen overflow-hidden">
      <Navbar activeIndex={0} />
      <div className="grid text-sm" style={{ height: '90vh' }}>
        <div className="col-9 flex flex-column pr-2" style={{ height: '90vh' }}>
          {/* Map caontainer */}
          <div className="h-full">
            <div className="border-yellow-500 border-solid border-1 border-round-xs h-full w-full">
              <MyMap
                defaultZoom={zoom}
                setZoom={setZoom}
                defaultCenter={center}
                setCenter={setCenter}
              />
            </div>
          </div>

          {/* Footer caontainer */}
          <div className="mt-3">
            <div className="grid m-0">
              <div className="col-4 flex p-0">
                <span className="p-buttonset">
                  <Button className="button" label="Map" />
                  <Button className="button" label="Cards" />
                  <Button className="button" label="List" />
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
                <DateTime format="ddd, MMMM Mo, Y, h:mm:ss A" />
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
                    icon="pi pi-refresh"
                    text
                    raised
                    size="small"
                    onClick={() => {
                      setZoom(16.2)
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
        <div className="col-3 pl-2 line-height-2" style={{ marginBottom: '1%' }}>
          <Card title="Miner Details" className="text-sm">
            <table>
              <tbody>
                <tr>
                  <td className="text-left">Miner ID:</td>
                  <td className="font-bold text-right vertical-align-middle">5566699956</td>
                </tr>
                <tr>
                  <td className="text-left">Miner Name:</td>
                  <td className="font-bold text-right vertical-align-middle">Miner One</td>
                </tr>
                <tr>
                  <td className="text-left">Shift:</td>
                  <td className="font-bold text-right vertical-align-middle">A1</td>
                </tr>
                <tr>
                  <td className="text-left">Node ID:</td>
                  <td className="font-bold text-right vertical-align-middle">NODE-JBLKBL955LUB</td>
                </tr>
                <tr>
                  <td className="text-left">Location:</td>
                  <td className="font-bold text-right vertical-align-middle">ACP-25</td>
                </tr>
                <tr>
                  <td className="text-left">Last Update:</td>
                  <td className="font-bold text-right vertical-align-middle">2023/05/05 12:00</td>
                </tr>
              </tbody>
            </table>
          </Card>
          <Divider type="dotted" />
          <Card title="Access Point" className="text-sm">
            <table>
              <tbody>
                <tr>
                  <td className="text-left">ID:</td>
                  <td className="font-bold text-right vertical-align-middle">AC-66699956</td>
                </tr>
                <tr>
                  <td className="text-left">Nodes:</td>
                  <td className="font-bold text-right vertical-align-middle">12</td>
                </tr>
                <tr>
                  <td className="text-left">Total Connections:</td>
                  <td className="font-bold text-right vertical-align-middle">12</td>
                </tr>
                <tr>
                  <td className="text-left">Location:</td>
                  <td className="font-bold text-right vertical-align-middle">Shaft-1</td>
                </tr>
                <tr>
                  <td className="text-left">Last Update:</td>
                  <td className="font-bold text-right vertical-align-middle">2023/05/05 12:00</td>
                </tr>
              </tbody>
            </table>
          </Card>
          <Divider type="dotted" />
          <Card title="Area Details" className="text-sm">
            <table>
              <tbody>
                <tr>
                  <td className="text-left">ID:</td>
                  <td className="font-bold text-right vertical-align-middle">SHAFT-1</td>
                </tr>
                <tr>
                  <td className="text-left">Supervisor Name:</td>
                  <td className="font-bold text-right vertical-align-middle">Supervisor One</td>
                </tr>
                <tr>
                  <td className="text-left">Nodes:</td>
                  <td className="font-bold text-right vertical-align-middle">22</td>
                </tr>
                <tr>
                  <td className="text-left">Total connections:</td>
                  <td className="font-bold text-right vertical-align-middle">45</td>
                </tr>
                <tr>
                  <td className="text-left">Location:</td>
                  <td className="font-bold text-right vertical-align-middle">West-wing</td>
                </tr>
                <tr>
                  <td className="text-left">Last Update:</td>
                  <td className="font-bold text-right vertical-align-middle">2023/05/05 12:00</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
      <OverlayPanel ref={op}>
        <div>
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-900"
            label="3 sec"
            onClick={() => updateInterval(3_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-900"
            label="10 sec"
            onClick={() => updateInterval(10_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-900"
            label="30 sec"
            onClick={() => updateInterval(30_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-900"
            label="1 min"
            onClick={() => updateInterval(60_000)}
          />
          <Button
            size="small"
            className="p-button-rounded p-button-text text-gray-900"
            label="5 min"
            onClick={() => updateInterval(300_000)}
          />
        </div>
      </OverlayPanel>
    </div>
  )
}

export default Dashbord
