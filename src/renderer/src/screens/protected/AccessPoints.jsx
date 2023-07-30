import axios from 'axios'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import Navbar from '../../components/Navbar'
import NewAccess from '../../components/NewAccess'
import NewSensor from '../../components/NewSensor'
import ManageSensor from '../../components/ManageSensor'
import ManageAccess from '../../components/ManageAccess'

import { API_URL } from '../../utils/exports'
import { catchHandler } from '../../utils/functions'

const AccessPoints = () => {
  const toast = useRef(null)

  const { user } = useSelector((state) => state.auth)
  const token = user ? user.token : 'token'
  const username = user ? user.username : 'username'

  const [sensors, setSensors] = useState([])
  const [loading, setLoading] = useState(false)
  const [addSensor, setAddSensor] = useState(false)
  const [addAccess, setAddAccess] = useState(false)
  const [selectedAccess, setAccess] = useState(null)
  const [selectedSensor, setSensor] = useState(null)
  const [accessPoints, setAccessPoints] = useState([])

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
        setAccessPoints(response.data)
        setAccess(response.data[0])
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
        setSensors(response.data)
        setSensor(response.data[0])
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
    <div className="w-full h-screen">
      <Navbar activeIndex={3} />
      <Toast ref={toast} />
      <div className="flex mt-1 " style={{ height: '95vh' }}>
        {/* Table div */}
        <div className="w-8 px-3 h-full">
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
            className="mb-2"
          >
            <Column field="id" header="Name" body={nameTemplate} />
            <Column field="active" header="Status" body={activeTemplate} />
            <Column
              field="id"
              header="Action"
              body={(e) => actionBodyTemplate(e, selectAccessPoint)}
            />
          </DataTable>

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
            className="mt-2"
          >
            <Column field="id" header="Name" body={nameTemplate} />
            <Column field="active" header="Status" body={activeTemplate} />
            <Column field="available" header="Available" body={availableTemplate} />
            <Column field="last_updated" header="Last Update" />
            <Column field="id" header="Action" body={(e) => actionBodyTemplate(e, selectSensor)} />
          </DataTable>
        </div>

        {/* Right div */}
        <div className="flex flex-column w-4 px-3">
          <ManageAccess
            data={selectedAccess}
            toastRef={toast}
            token={token}
            username={username}
            refresh={getAccessPoints}
          />
          <ManageSensor
            data={selectedSensor}
            toastRef={toast}
            token={token}
            username={username}
            refresh={getSensors}
          />
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
  scrollHeight: 'calc(100vh - 15rem)',
  removableSort: true,
  style: { width: '100%', height: '48%' }
}

const header = ({ text, action, isLoading, refresh }) => {
  return (
    <div className="flex flex-wrap justify-content-between gap-2">
      <div className="flex flex-wrap gap-2">
        <h3 className="my-1">{text}</h3>
      </div>
      <div className="flex flex-wrap justify-content-end gap-2">
        <Button icon={`pi pi-plus`} onClick={action} size="small" label="Add new" />
        <Button
          disabled={isLoading}
          icon={`pi pi-refresh ${isLoading && 'pi-spin'}`}
          onClick={refresh}
          text
        />
      </div>
    </div>
  )
}

const activeTemplate = (rowData) => {
  return (
    <div className="flex align-items-center">
      <span className={`dot ${rowData.active === 1 ? 'dot-active' : 'dot-inactive'}`} />
      <span className="ml-2">{rowData.active === 1 ? 'On' : 'Off'}</span>
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
      <span className="ml-2">{rowData.id.substring(0, 10)}</span>
    </div>
  )
}

export default AccessPoints
