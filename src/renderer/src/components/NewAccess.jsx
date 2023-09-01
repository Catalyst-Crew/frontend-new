import { useState } from 'react'
import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'
import { Dialog } from 'primereact/dialog'
import { useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../utils/exports'
import { catchHandler, showToast } from '../utils/functions'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'

const NewAccess = ({ visible, setVisible, refresh, toastRef }) => {
  const { user } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [accessPoint, setAccessPoint] = useState(null)
  const [areas, setAreas] = useState([
    {
      id: 1_000_000,
      id_prefix: 'are-',
      name: 'Shaft-A1',
      lat: '-26.260693',
      longitude: '29.121075'
    }
  ])

  useEffect(() => {
    getAreas()
  }, [])

  const getAreas = () => {
    if (localStorage.getItem('areasData')) {
      setAreas(JSON.parse(localStorage.getItem('areasData')));
    }
    axios
      .get(`${API_URL}/areas`, {
        headers: { 'x-access-token': user.token }
      })
      .then((response) => {
        setAreas(response.data)
        localStorage.setItem('areasData', JSON.stringify(response.data))
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
  }

  const addAccessPoint = () => {
    setLoading(true)

    if (!accessPoint.name || !accessPoint.area_id || !accessPoint.lat || !accessPoint.longitude) {
      showToast('error', 'Error', 'Please fill all fields', toastRef)
      setLoading(false)
      return
    }

    axios
      .post(
        `${API_URL}/access-points`,
        {
          ...accessPoint,
          username: user.id,
          status: 0,
          latitude: accessPoint.lat,
          longtitude: accessPoint.longitude
        },
        {
          headers: { 'x-access-token': user.token }
        }
      )
      .then(() => {
        showToast('success', 'Success', 'Access point added successfully', toastRef)
        setVisible(false)
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
      .finally(() => {
        refresh()
        setLoading(false)
      })
  }
  return (
    <Dialog
      header="Add new access point"
      visible={visible}
      style={{ width: '30vw' }}
      onHide={() => setVisible(false)}
    >
      <div className="flex flex-column gap-3">
        <div className="flex flex-column gap-2">
          <label htmlFor="name">Name:</label>
          <InputText
            id="name"
            value={accessPoint?.name}
            onChange={(e) => setAccessPoint({ ...accessPoint, name: e.target.value })}
          />
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="device_id">Device ID: (optional)</label>
          <InputText
            id="device_id"
            value={accessPoint?.device_id}
            onChange={(e) => setAccessPoint((prev) => ({ ...prev, device_id: e.target.value }))}
          />
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="area">Area:</label>
          <Dropdown
            id="area"
            value={accessPoint?.area_id}
            onChange={(e) => setAccessPoint((prev) => ({ ...prev, area_id: e.value }))}
            options={areas}
            optionLabel="name"
            placeholder="Area"
            optionValue="id"
          />
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="lat">Latitude:</label>
          <InputText
            id="lat"
            value={accessPoint?.lat}
            onChange={(e) => {
              setAccessPoint((prev) => ({ ...prev, lat: e.target.value }))
            }}
            max={90}
            maxLength={9}
          />
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="longitude">Longitude:</label>
          <InputText
            id="longitude"
            value={accessPoint?.longitude}
            onChange={(e) => {
              setAccessPoint((prev) => ({
                ...prev,
                longitude: e.target.value
              }))
            }}
            max={180}
            maxLength={9}
          />
        </div>

        <div className="flex gap-4 mt-3">
          <Button
            size="small"
            label="Save"
            icon="pi pi-check"
            className="w-full"
            iconPos="right"
            loading={loading}
            onClick={addAccessPoint}
          />
          <Button
            loading={loading}
            size="small"
            severity="danger"
            label="Cancel"
            icon="pi pi-times"
            className="w-full"
            iconPos="right"
            onClick={() => {
              setVisible(false)
            }}
          />
        </div>
      </div>
    </Dialog>
  )
}

NewAccess.propTypes = {
  visible: PropTypes.bool,
  user: PropTypes.object,
  setVisible: PropTypes.func,
  refresh: PropTypes.func,
  toastRef: PropTypes.object
}

export default NewAccess
