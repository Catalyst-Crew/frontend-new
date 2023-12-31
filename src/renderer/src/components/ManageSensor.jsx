import axios from 'axios'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace'

import staticData from '../assets/staticData.json'
import { ADMIN_ROLE, API_URL } from '../utils/exports'
import { catchHandler, showToast } from '../utils/functions'

export default function ManageSensor({ data, toastRef, token, username, refresh }) {
  const [sensorData, setData] = useState(null)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (data) {
      setData(data)
    }
  }, [data])

  const updateSensor = () => {
    axios
      .put(
        `${API_URL}/sensors`,
        { ...sensorData, username },
        {
          headers: { 'x-access-token': token }
        }
      )
      .then((response) => {
        showToast('success', 'Success', response.data.message, toastRef)
        setData({ ...sensorData, device_id: null })
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
      .finally(() => {
        refresh()
      })
  }

  const unassignEmployee = () => {
    axios
      .put(
        `${API_URL}/sensors/unassign/${data.id}`,
        { username },
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
  }

  const unassignDevice = () => {
    axios
      .put(
        `${API_URL}/sensors/unassign`,
        { username, device_id: data?.deviceId, id: data?.id },
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
  }

  const confirm = () => {
    confirmDialog({
      message: () => {
        return (
          <div className="flex flex-column gap-2">
            <h4 className="p-danger">
              You are about to UNASSIGN a sensor from an employee or a device?
            </h4>
            <p>
              Unassigning this sensor from a device will automatically unassign this sensor from an
              employee.
            </p>
            <p>Are you sure you want to proceed?</p>
          </div>
        )
      },
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      reject: unassignDevice,
      accept: unassignEmployee,
      rejectLabel: 'Unassign from a device',
      acceptLabel: 'Unassign from an employee',
      keepInViewport: true
    })
  }

  return (
    <Card title="Manage Sensor" className="mt-2" subTitle={`${data?.id_prefix}${data.id}`}>
      <div className="card flex flex-column gap-2 mt-3 ml-2">
        <div className="flex gap-2 align-items-center h-2rem">
          <label htmlFor="access">Device ID:</label>
          <Inplace closable disabled={user.user_role_id !== ADMIN_ROLE}>
            <InplaceDisplay>
              <p className="my-1">{sensorData?.device_id || 'Click to edit'}</p>
            </InplaceDisplay>
            <InplaceContent>
              <InputText
                value={sensorData?.device_id}
                onChange={(e) => setData((prev) => ({ ...prev, device_id: e.target.value }))}
                autoFocus
              />
            </InplaceContent>
          </Inplace>
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
            className="w-full md:w-14rem"
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
            className="w-full md:w-14rem"
          />
        </div>

        <div className="mt-1 flex flex-column">
          <div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <p className="m-0 mt-2">Updated:</p>
                  </td>
                  <td>
                    <p className="m-0  mt-2 font-bold">
                      {moment(sensorData?.updated_at).format('LLL')}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="m-0">Updated by:</p>
                  </td>
                  <td>
                    <p className="m-0 font-bold">{sensorData?.updated_by}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-2 flex flex-column  justify-content-end">
          <Button
            className="w-full "
            label="Update"
            size="small"
            onClick={updateSensor}
            icon="pi pi-check"
          />
          <Button
            className="w-full mt-3"
            label="Unassign"
            size="small"
            outlined
            onClick={confirm}
            severity="danger"
            icon="pi pi-times"
            disabled={user.user_role_id !== ADMIN_ROLE}
          />
        </div>
      </div>
      <ConfirmDialog />
    </Card>
  )
}

ManageSensor.propTypes = {
  data: PropTypes.object,
  toastRef: PropTypes.object,
  token: PropTypes.string,
  username: PropTypes.number,
  refresh: PropTypes.func
}
