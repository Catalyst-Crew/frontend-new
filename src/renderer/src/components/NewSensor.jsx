import axios from 'axios'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'

import { API_URL } from '../utils/exports'
import { showToast } from '../utils/functions'
import { InputText } from 'primereact/inputtext'
import staticData from '../assets/staticData.json'

const NewSensor = ({ visible, setVisible, refresh, toastRef }) => {
  const [sensorData, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => state.auth)

  const addSensor = () => {
    setLoading(true)

    if (!sensorData?.available && !sensorData?.status) {
      showToast('error', 'Error', 'Please fill all fields', toastRef)
      setLoading(false)
      return
    }

    axios
      .post(
        `${API_URL}/sensors`,
        {
          ...sensorData,
          user_id: user.id
        },
        {
          headers: { 'x-access-token': user.token }
        }
      )
      .then((res) => {
        showToast('success', 'Success', res.data.message, toastRef)
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
      header="Add new sensor"
      visible={visible}
      style={{ width: '30vw' }}
      onHide={() => setVisible(false)}
    >
      <div className="flex flex-column gap-3">
        <div className="flex flex-column gap-2">
          <label htmlFor="device_id">Device ID: (optional)</label>
          <InputText
            id="device_id"
            value={sensorData?.device_id}
            onChange={(e) => setData((prev) => ({ ...prev, device_id: e.target.value }))}
          />
        </div>

        <div className="flex flex-column gap-2 ">
          <label htmlFor="reason">Status:</label>
          <Dropdown
            value={sensorData?.status}
            onChange={(e) => setData((prev) => ({ ...prev, status: e.value }))}
            options={staticData.switchState}
            optionLabel="name"
            optionValue="status"
            placeholder="Select Status"
          />
        </div>
        <div className="flex flex-column gap-2 ">
          <label htmlFor="reason">Available:</label>
          <Dropdown
            value={sensorData?.available}
            onChange={(e) => setData((prev) => ({ ...prev, available: e.value }))}
            options={staticData.availabeState}
            optionLabel="name"
            optionValue="available"
            placeholder="Select Status"
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
            onClick={addSensor}
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

NewSensor.propTypes = {
  visible: PropTypes.bool,
  user: PropTypes.object,
  setVisible: PropTypes.func,
  refresh: PropTypes.func,
  toastRef: PropTypes.object
}

export default NewSensor
