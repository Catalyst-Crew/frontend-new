import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Splitter, SplitterPanel } from 'primereact/splitter'

import Navbar from '../../components/Navbar'
import NewAccess from '../../components/NewAccess'
import NewSensor from '../../components/NewSensor'
import ManageSensor from '../../components/ManageSensor'
import ManageAccess from '../../components/ManageAccess'

import CopyText from '../../components/CopyText'
import { catchHandler } from '../../utils/functions'
import { ADMIN_ROLE, API_URL } from '../../utils/exports'

const AccessPoints = () => {
  const toast = useRef(null)

  const { user } = useSelector((state) => state.auth)

  const name = user ? user.id : 999_999
  const token = user ? user.token : 'token'

  const [sensors, setSensors] = useState([
    {
      id: 1_000_001,
      id_prefix: 'sen-',
      status: 0,
      device_id: null,
      available: 1,
      updated_by: 'System',
      updated_at: '2023-08-08T18:24:17.000Z',
      created_by: 'system',
      created_at: '2023-08-08T18:24:17.000Z'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [addSensor, setAddSensor] = useState(false)
  const [addAccess, setAddAccess] = useState(false)
  const [selectedAccess, setAccess] = useState(null)
  const [selectedSensor, setSensor] = useState(null)
  const [accessPoints, setAccessPoints] = useState([
    {
      id: 1_000_000,
      id_prefix: 'acc-',
      area_id: 1_000_000,
      name: 'A1-1',
      lat: '-26.260693',
      longitude: '29.121075',
      area_id_prefix: 'are-',
      area_name: 'Shaft-A1',
      location: '-26.260693,29.121075',
      area_lat: '-26.260693',
      area_longitude: '29.121075'
    }
  ]) 

  useEffect(() => {
    return fetchData()
  }, [])

  const selectAccessPoint = (id) => {
    setAccess(accessPoints.find((item) => item.id === id))
  }

  const selectSensor = (id) => {
    setSensor(sensors.find((item) => item.id === id))
  }

  const fetchData = () => {
    setLoading(true)
    getAccessPoints(true)
    getSensors(true)
  }

  const getAccessPoints = (load = false) => {
    if (load) {
      setLoading(true)
    }

    axios
      .get(`${API_URL}/access-points`, {
        headers: { 'x-access-token': token }
      })
      .then((response) => {
        setAccess(response.data[0])
        setAccessPoints(response.data)
      })
      .catch((error) => {
        catchHandler(error, toast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getSensors = (load = false) => {
    if (load) {
      setLoading(true)
    }

    axios
      .get(`${API_URL}/sensors/all`, {
        headers: { 'x-access-token': token }
      })
      .then((response) => {
        setSensor(response.data[0])
        setSensors(response.data)
      })
      .catch((error) => {
        catchHandler(error, toast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const actionBodyTemplate = (sensorId, action) => {
    return (
      <div className="flex align-items-center">
        <Button label="Manage" onClick={() => action(sensorId.id)} size="small" />
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden" style={{ height: '97vh' }}>
      <Navbar activeIndex={3} />
      <Toast ref={toast} />
      <div className="flex">

        {/* Table div */}
        <div className="w-8" style={{height:"87vh"}}>

          <Splitter layout="vertical" className='h-full'>
            <SplitterPanel
              className="flex justify-content-center"
              size={25} minSize={10}
            >
              <DataTable
                value={accessPoints}
                header={() =>
                  header({
                    text: 'Access Points',
                    refresh: getAccessPoints,
                    isLoading: loading,
                    action: () => setAddAccess(true)
                  })
                }
                {...tableOptions}
              >
                <Column field="id" header="ID" body={nameTemplate} />
                <Column field="name" header="Name" />
                <Column field="status" header="Status" body={activeTemplate} />
                <Column
                  field="location"
                  header="Location"
                  body={(e) => <CopyText text={e.location} label={e.area_name} />}
                />
                <Column
                  field="id"
                  header="Action"
                  body={(e) => actionBodyTemplate(e, selectAccessPoint)}
                />
              </DataTable>
            </SplitterPanel>

            <SplitterPanel
              className="flex align-items-center justify-content-center"
              size={75}
            >
              <DataTable
                value={sensors}
                header={() =>
                  header({
                    text: 'Sensors',
                    refresh: getSensors,
                    isLoading: loading,
                    action: () => setAddSensor(true)
                  })
                }
                {...tableOptions}
                paginator
              >
                <Column field="id" header="ID" body={nameTemplate} />
                <Column field="status" header="Status" body={activeTemplate} />
                <Column field="available" header="Available" body={availableTemplate} />
                <Column
                  field="updated_at"
                  header="Last Update"
                  body={(e) => <>{moment(e.updated_at).fromNow()}</>}
                />
                <Column field="device_id" header="Device ID" />
                <Column
                  field="id"
                  header="Action"
                  body={(e) => actionBodyTemplate(e, selectSensor)}
                />
              </DataTable>
            </SplitterPanel>
          </Splitter>

        </div>

        {/* Right div */}
        <div className="flex flex-column w-4 px-3">
          {selectedAccess && (
            <ManageAccess
              data={selectedAccess}
              toastRef={toast}
              token={token}
              username={name}
              refresh={getAccessPoints}
            />
          )}
          {selectedSensor && (
            <ManageSensor
              data={selectedSensor}
              toastRef={toast}
              token={token}
              username={name}
              refresh={getSensors}
            />
          )}
        </div>
        <NewAccess
          visible={addAccess}
          setVisible={setAddAccess}
          refresh={fetchData}
          toastRef={toast}
        />
        <NewSensor
          visible={addSensor}
          setVisible={setAddSensor}
          refresh={fetchData}
          toastRef={toast}
        />
      </div>
    </div>
  )
}

const tableOptions = {
  rows: 10,
  rowsPerPageOptions: [10, 25, 50, 100],
  stripedRows: true,
  scrollable: true,
  scrollHeight: 'calc(100vh - 10rem)',
  removableSort: true,
  style: { width: '100%' },
  className: 'p-datatable-sm'
}

const header = ({ text, action, isLoading, refresh }) => {
  const { user } = useSelector((state) => state.auth)
  return (
    <div className="flex flex-wrap justify-content-between">
      <h3 className="my-1">{text}</h3>
      <div className="flex flex-wrap justify-content-end gap-2">
        <Button
          icon={`pi pi-plus`}
          onClick={action}
          size="small"
          label="Add new"
          disabled={user.user_role_id !== ADMIN_ROLE}
        />
        <Button
          disabled={isLoading}
          icon={`pi pi-refresh ${isLoading && 'pi-spin'}`}
          onClick={refresh}
          text
          size="small"
        />
      </div>
    </div>
  )
}

const activeTemplate = (rowData) => {
  return (
    <div className="flex align-items-center">
      <span className={`dot ${rowData.status === 1 ? 'dot-active' : 'dot-inactive'}`} />
      <span className="ml-2">{rowData.status === 1 ? 'On' : 'Off'}</span>
    </div>
  )
}

const availableTemplate = (rowData) => {
  return (
    <div className="flex align-items-center">
      <span className={`dot ${rowData.available === 1 ? 'dot-active' : 'dot-inactive'}`} />
      <span className="ml-2">{rowData.available === 1 ? 'On' : 'Off'}</span>
    </div>
  )
}

const nameTemplate = (rowData) => {
  return (
    <div className="flex align-items-center">
      <span className="ml-2">{`${rowData.id_prefix}${rowData.id}`}</span>
    </div>
  )
}

export default AccessPoints
