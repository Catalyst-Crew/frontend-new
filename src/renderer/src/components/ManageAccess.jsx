import axios from 'axios'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'

import { API_URL } from '../utils/exports'
import staticData from '../assets/staticData.json'
import { catchHandler, showToast } from '../utils/functions'

const ManageAccess = ({ data, toastRef, token, username, refresh }) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedAccess, setAccess] = useState(null)
  const [accessPoint, setAccessPoint] = useState(null)
  const [areas, setAreas] = useState([
    {
      id: 1000000,
      id_prefix: 'are-',
      name: 'Shaft-A1',
      lat: '-26.260693',
      longitude: '29.121075'
    }
  ])

  useEffect(() => {
    if (data) {
      setAccess(data.status)
      setAccessPoint(data)
    }
    return getAreas()
  }, [data])

  const updateStatus = (status) => {
    setLoading(status)

    axios
      .put(
        `${API_URL}/access-points/${data.id}`,
        { status, username },
        {
          headers: { 'x-access-token': token }
        }
      )
      .then((response) => {
        showToast('success', 'Success', response.data.message, toastRef)
        refresh()
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getAreas = () => {
    axios
      .get(`${API_URL}/areas`, {
        headers: { 'x-access-token': token }
      })
      .then((response) => {
        setAreas(response.data)
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
  }

  const updateAccessPoint = () => {
    setLoading(true)

    axios
      .put(
        `${API_URL}/access-points/full/${data.id}`,
        { ...accessPoint, username },
        {
          headers: { 'x-access-token': token }
        }
      )
      .then((response) => {
        showToast('success', 'Success', response.data.message, toastRef)
        refresh()
        setVisible(false)
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Card title="Manage point" className="mb-2" subTitle={`${data?.id_prefix}${data.id}`}>
      <div className="card flex mt-3">
        <div className="flex">
          <div className="flex flex-column gap-2 ml-2">
            <label htmlFor="access">Active:</label>
            <Dropdown
              value={selectedAccess}
              onChange={(e) => updateStatus(e.value)}
              options={staticData.switchState}
              optionLabel="name"
              placeholder="Status"
              optionValue="status"
              className="w-full md:w-14rem"
            />
          </div>
          <Button
            label="More settings"
            icon="pi pi-external-link"
            size="small"
            className="mt-4 ml-2"
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
      <Dialog
        header="More settings"
        visible={visible}
        style={{ width: '30vw' }}
        onHide={() => setVisible(false)}
        position="top-right"
      >
        <div className="flex flex-column gap-3">
          <div className="flex flex-column gap-2">
            <label htmlFor="name">Name:</label>
            <InputText
              id="name"
              value={accessPoint?.name}
              onClick={(e) => setAccessPoint((prev) => ({ ...prev, name: e.value }))}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="device_id">Device ID:</label>
            <InputText
              id="device_id"
              value={accessPoint?.device_id}
              onClick={(e) => setAccessPoint((prev) => ({ ...prev, device_id: e.value }))}
            />
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="area">Area:</label>
            <Dropdown
              id="area"
              value={accessPoint?.area_id}
              onClick={(e) => selectedAccess((prev) => ({ ...prev, area_id: e.value }))}
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
              onClick={(e) => {
                setAccessPoint((prev) => ({ ...prev, lat: e.value }))
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
              onClick={(e) => {
                setAccessPoint((prev) => ({
                  ...prev,
                  longitude: e.value
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
              onClick={updateAccessPoint}
            />
            <Button
              loading={loading}
              size="small"
              severity="danger"
              label="Reset"
              icon="pi pi-refresh"
              className="w-full"
              iconPos="right"
              onClick={() => {
                setAccessPoint(data)
              }}
            />
          </div>
        </div>
      </Dialog>
    </Card>
  )
}

ManageAccess.propTypes = {
  data: PropTypes.object,
  toastRef: PropTypes.object,
  token: PropTypes.string,
  username: PropTypes.string,
  refresh: PropTypes.func
}

export default ManageAccess
