//import Clock from 'react-live-clock'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'

import MyMap from '../../components/Map'
import Navbar from '../../components/Navbar'

const Dashbord = () => {
  const navigator = useNavigate()
  const [zoom, setZoom] = useState(16.2)
  const [center, setCenter] = useState([-26.260693, 29.121075])

  return (
    <div className="max-h-screen max-w-screen overflow-hidden">
      <Navbar activeIndex={0} />
      <div className="grid mt-4 text-sm">
        <div className="col-9 flex flex-column  pr-2">
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
                <Badge value="" severity="success" />
              </div>
              <div className="col-3 p-0 flex align-items-center">
                {/* <Clock
                  format={'dddd, MMMM Do YYYY, h:mm:ss a'}
                  ticking={true}
                  className="text-yellow-500 align-self-center"
                /> */}
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
    </div>
  )
}

export default Dashbord
