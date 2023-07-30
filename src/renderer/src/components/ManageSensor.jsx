import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace'

import { API_URL } from '../utils/exports'
import staticData from '../assets/staticData.json'
import { catchHandler, showToast } from '../utils/functions'

export default function ManageSensor({ data, toastRef, token, username, refresh }) {
  const [sensorData, setData] = useState(null)

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
        refresh()
      })
      .catch((error) => {
        catchHandler(error, toastRef)
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
        { username, deviceId: data?.deviceId, id: data?.id },
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
              You are about to Unassign a node from an employee or a device?
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
    <Card title="Manage Sensor" className="mt-2" subTitle={data?.id.substring(0, 10)}>
      <div className="card flex flex-column gap-2 mt-3 ml-2">
        <div className="flex flex-column gap-2 ">
          <label htmlFor="access">Device ID:</label>
          <Inplace closable>
            <InplaceDisplay>
              <p className="my-1">{sensorData?.deviceId || 'Click to edit'}</p>
            </InplaceDisplay>
            <InplaceContent>
              <InputText
                value={sensorData?.deviceId}
                onChange={(e) => setData((prev) => ({ ...prev, deviceId: e.value }))}
                autoFocus
              />
            </InplaceContent>
          </Inplace>
        </div>

        <div className="flex flex-column gap-2 ">
          <label htmlFor="reason">Status:</label>
          <Dropdown
            value={sensorData?.active}
            onChange={(e) => setData((prev) => ({ ...prev, active: e.value }))}
            options={staticData.switchState}
            optionLabel="status"
            optionValue="code"
            placeholder="Select Status"
            className="w-full md:w-14rem"
          />
        </div>
        <div className="flex flex-column gap-2 ">
          <label htmlFor="reason">Available:</label>
          <Dropdown
            value={sensorData?.available}
            onChange={(e) => setData((prev) => ({ ...prev, available: e.value }))}
            options={staticData.switchState}
            optionLabel="status"
            optionValue="code"
            placeholder="Select Status"
            className="w-full md:w-14rem"
          />
        </div>

        <div className="mt-3 flex flex-column">
          <div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <p className="m-0 mt-2">Updated:</p>
                  </td>
                  <td>
                    <p className="m-0  mt-2 font-bold">{sensorData?.last_updated}</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="m-0">Updated by:</p>
                  </td>
                  <td>
                    <p className="m-0 font-bold">{sensorData?.modified_by}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 flex justify-content-end">
          <Button className="w-8 mr-2" label="Update" size="small" onClick={updateSensor} />
          <Button
            className="w-4 ml-2"
            label="Unassign"
            size="small"
            outlined
            onClick={confirm}
            severity="danger"
            icon="pi pi-times"
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
  username: PropTypes.string,
  refresh: PropTypes.func
}
