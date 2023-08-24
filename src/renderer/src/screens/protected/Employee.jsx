import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

import Navbar from '../../components/Navbar'
import { API_URL } from '../../utils/exports'
import username from '../../components/UserName'
import staticData from '../../assets/staticData.json'
import NewEmployee from '../../components/NewEmployee'
import { catchHandler, showToast } from '../../utils/functions'

import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

const testEmployee = {
  id: 999_999,
  id_prefix: 'min-',
  user_name: 'Test Employee',
  email: 'test@mail.com',
  status: 1,
  created_at: '2023-08-07T13:29:47.000Z',
  created_by: 'System',
  updated_at: '2023-08-07T13:29:47.000Z',
  updated_by: 'System',
  supervisor_id: 1_000_000,
  shift_id: 1_000_000,
  sensor_id: null,
  supervisor_name: 'Test Supervisor',
  shift_name: 'Day'
}

const Employee = () => {
  const toast = useRef(null)
  const { user } = useSelector((state) => state.auth)

  const [nodeId, setNodeId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [employess, setEmployees] = useState([testEmployee])
  const [supervisors, setSupervisors] = useState([
    {
      user_id: 1_000_008,
      user_id_prefix: 'user-',
      user_name: 'Test Supervisor',
      role_name: 'Supervisor',
      role_id: 1_000_001
    }
  ])
  const [availabeNodes, setAvailabeNodes] = useState([])
  const [selectedShift, setSelectedShift] = useState(null)
  const [selectedSupervisor, setSelectedSupervisor] = useState(null)
  const [selectedEmployee, setSelectEmloyee] = useState(testEmployee)

  useEffect(() => {
    refresh()
  }, [])

  const token = user ? user.token : 'token'
  const name = user ? user.id_prefix + user.id : 'user-999999'

  const refresh = () => {
    fetchNodes()
    fetchtEmployees()
    fetchSupervisor()
  }

  const deleteEmployee = (action) => {
    axios
      .delete(`${API_URL}/miners/${action}/${selectedEmployee.id}/${name}`, {
        headers: { 'x-access-token': token }
      })
      .then((res) => {
        showToast('success', 'Success', res.data.message, toast)
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
      .finally(() => {
        fetchtEmployees()
        fetchNodes()
      })
  }

  const confirm = () => {
    confirmDialog({
      message: 'Are you sure you want to delete employee?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      reject: () => deleteEmployee('delete'),
      accept: () => deleteEmployee('deactivate'),
      acceptLabel: 'Deactivate instead',
      rejectLabel: 'Delete',
      rejectClassName: 'text-red-500 p-button-text p-button-danger',
      keepInViewport: true
    })
  }

  const fetchtEmployees = () => {
    axios
      .get(`${API_URL}/miners`, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.data.data.length === 0) {
          return
        }
        setSelectEmloyee(res.data.data[0])
        setEmployees(res.data.data)
        setNodeId(res.data.data[0].sensor_id)
        setSelectedShift(res.data.data[0].shift_id)
        setSelectedSupervisor(res.data.data[0].supervisor_id)
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  const updateEmployee = () => {
    const data = {
      sensorsid: nodeId,
      shift: selectedShift,
      supervisor_id: selectedSupervisor,
      updated_by: name
    }

    axios
      .put(`${API_URL}/miners/${selectedEmployee.id}`, data, {
        headers: { 'x-access-token': token }
      })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        showToast('success', 'Success', 'User updated successfully', toast)
        refresh()
      })
      .catch((e) => {
        catchHandler(e, toast)
      })
  }

  const actionBodyTemplate = (userId) => {
    return (
      <div className="flex align-items-center">
        <Button
          label="Manage"
          onClick={() => selectEmployee(userId)}
          size="small"
          disabled={userId.id === 999_999}
        />
      </div>
    )
  }

  const selectEmployee = (userData) => {
    const user = employess.find((user) => user.id === userData.id)
    setSelectEmloyee(user)
    setNodeId(user.sensor_id)
    setSelectedSupervisor(user.supervisor_id)
    setSelectedShift(user.shift_id)
  }

  const fetchNodes = () => {
    axios
      .get(`${API_URL}/sensors`, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status == 200) {
          setAvailabeNodes(res.data.data)
          return
        }
        showToast('warn', 'Attention', res.data.message, toast)
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  const fetchSupervisor = () => {
    axios
      .get(`${API_URL}/users/supervisors`, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status == 200) {
          setSupervisors(res.data.data)
          return
        }
        showToast('warn', 'Attention', res.data.message, toast)
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  return (
    <div className="max-h-screen overflow-hidden">
      <Navbar activeIndex={2} />
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex h-max-h-full">
        {/* Table div */}
        <div className="w-8 px-3 ">
          <DataTable
            value={employess}
            scrollable
            className="max-h-full"
            scrollHeight="calc(100vh - 5rem)"
          >
            <Column
              header="Name"
              filterField="user_name"
              filter
              filterPlaceholder="Search by name"
              body={username}
            />
            <Column field="shift_name" sortable header="Shift" />
            <Column field="supervisor_name" sortable header="Supervisor" />
            <Column header="Action" body={actionBodyTemplate} />
          </DataTable>
        </div>

        {/* Right div */}
        <div className="flex flex-column w-4 px-3">
          <Button onClick={() => setVisible(true)} className="add text-center mt-1 mb-2">
            Add Employee
          </Button>

          <Card className="sidebar">
            {username(selectedEmployee)}

            <div className="mt-4">
              <div className="flex flex-column gap-2 text-left">
                <label htmlFor="username">Node ID:</label>
                <Dropdown
                  value={nodeId}
                  onChange={(e) => setNodeId(e.value)}
                  options={availabeNodes}
                  optionLabel="id"
                  optionValue="id"
                  placeholder={nodeId ? nodeId : 'Assign node'}
                  className="w-full p-inputtext-sm"
                />
              </div>

              <div className="flex flex-column gap-2 text-left mt-3">
                <label htmlFor="username">Shift:</label>
                <Dropdown
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.value)}
                  options={staticData.shift}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Access Level"
                  className="w-full p-inputtext-sm"
                />
              </div>

              <div className="flex flex-column gap-2 text-left mt-3">
                <label htmlFor="username">Supervisor:</label>
                <Dropdown
                  value={selectedSupervisor}
                  onChange={(e) => setSelectedSupervisor(e.value)}
                  options={supervisors}
                  optionLabel="user_name"
                  optionValue="user_id"
                  placeholder="Select Supervisor"
                  className="w-full p-inputtext-sm"
                />
              </div>

              <div className="mt-3 flex flex-column">
                <div>Activity:</div>

                <div>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p className="m-0 mt-4">Updated:</p>
                        </td>
                        <td>
                          <p className="m-0  mt-4 font-bold">
                            {moment(selectedEmployee.updated_at).format('LLL')}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="m-0">Updated by:</p>
                        </td>
                        <td>
                          <p className="m-0 font-bold">{selectedEmployee.updated_by}</p>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <p className="m-0 mt-4">Created:</p>
                        </td>
                        <td>
                          <p className="m-0  mt-4 font-bold">
                            {moment(selectedEmployee.created_at).format('LLL')}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Created by:</td>
                        <td>
                          <p className="m-0 font-bold">{selectedEmployee.created_by}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-3 flex justify-content-end">
                <Button
                  className="w-9 mr-2"
                  label="Save"
                  size="small"
                  onClick={updateEmployee}
                  disabled={selectedEmployee.id === 999_999}
                />
                <Button
                  className="w-3 ml-2"
                  label="Delete"
                  size="small"
                  outlined
                  onClick={confirm}
                  severity="danger"
                  icon="pi pi-times"
                  disabled={selectedEmployee.id === 999_999}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <NewEmployee
        visible={visible}
        setVisible={setVisible}
        toastRef={toast}
        refresh={fetchtEmployees}
      />
    </div>
  )
}

export default Employee
