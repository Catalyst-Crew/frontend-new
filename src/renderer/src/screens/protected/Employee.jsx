import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

import Navbar from '../../components/Navbar'
import { API_URL } from '../../utils/exports'
import { catchHandler, showToast } from '../../utils/functions'
import staticData from '../../assets/staticData.json'
import NewEmployee from '../../components/NewEmployee'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

const Employee = () => {
  const toast = useRef(null)
  const { user } = useSelector((state) => state.auth)

  const [nodeId, setNodeId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [employess, setEmployees] = useState([])
  const [supervisors, setSupervisors] = useState(null)
  const [availabeNodes, setAvailabeNodes] = useState(null)
  const [selectedShift, setSelectedShift] = useState(null)
  const [selectedSupervisor, setSelectedSupervisor] = useState(null)
  const [selectedEmployee, setSelectEmloyee] = useState({
    id: '',
    name: '',
    shift: '',
    sensorsid: null,
    created_by: '',
    updated_by: '',
    last_updated: '',
    created: '',
    supervisor_name: '',
    supervisor_id: ''
  })

  useEffect(() => {
    refresh()
  }, [])

  //const userId = user ? user.id : 'USER-2096fd6e-eea0-4ec4-a4d9-e620933f83ab'
  const token = user ? user.token : 'token'
  const name = user ? user.name : 'Admin'

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
        fetchtEmployees()
      })
      .catch((err) => {
        catchHandler(err, toast)
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
        setSelectEmloyee(res.data.data[0])
        setEmployees(res.data.data)
        setNodeId(res.data.data[0].sensorsid)
        setSelectedShift(res.data.data[0].shift)
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
        <Button label="Manage" onClick={() => selectEmployee(userId)} size="small" />
      </div>
    )
  }

  const selectEmployee = (userData) => {
    const user = employess.find((user) => user.id === userData.id)
    setSelectEmloyee(user)
    setNodeId(user.sensorsid)
    setSelectedSupervisor(user.supervisor_id)
    setSelectedShift(user.shift)
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

      <div className="flex mt-3 h-max-h-full">
        {/* Table div */}
        <div className="w-8 px-3 ">
          <DataTable
            value={employess}
            scrollable
            className="max-h-full"
            scrollHeight="calc(100vh - 15rem)"
          >
            <Column
              header="Name"
              filterField="name"
              filter
              filterPlaceholder="Search by name"
              body={imageBodyTemplate}
            />
            <Column field="shift" sortable header="Shift" />
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
            {imageBodyTemplate(selectedEmployee)}

            <div className="mt-4">
              <div className="flex flex-column gap-2 text-left">
                <label htmlFor="username">Node ID:</label>
                <Dropdown
                  value={nodeId}
                  onChange={(e) => setNodeId(e.value)}
                  options={availabeNodes}
                  optionLabel="id"
                  optionValue="id"
                  placeholder="Assign node"
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
                  optionLabel="name"
                  optionValue="id"
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
                          <p className="m-0  mt-4 font-bold">{selectedEmployee.last_updated}</p>
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
                          <p className="m-0  mt-4 font-bold">{selectedEmployee.created}</p>
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
                <Button className="w-9 mr-2" label="Save" size="small" onClick={updateEmployee} />
                <Button
                  className="w-3 ml-2"
                  label="Delete"
                  size="small"
                  outlined
                  onClick={confirm}
                  severity="danger"
                  icon="pi pi-times"
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

const imageBodyTemplate = (user) => {
  let name = ''

  if (user.name.includes(' ')) {
    const nameArr = user.name.split(' ')
    name = nameArr[0][0] + nameArr[1][0]
  } else {
    name = user.name.substring(0, 2)
  }

  return (
    <div className="flex align-items-center">
      <Avatar
        className="p-overlay-badge"
        label={name.toUpperCase()}
        size="large"
        style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
        shape="circle"
      >
        <Badge severity={user.sensorsid ? 'success' : 'danger'} />
      </Avatar>
      <div className="ml-2">
        <p className="font-bold m-0 p-0">{user.name}</p>
        <p className="text-sm m-0 p-0">{user.email}</p>
        <p className="text-sm m-0 p-0 cursor-pointer">{`MID: ...${user.id.split('-')[4]}`}</p>
      </div>
    </div>
  )
}
