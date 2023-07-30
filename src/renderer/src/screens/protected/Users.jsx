import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'

import Navbar from '../../components/Navbar'
import { API_URL } from '../../utils/exports'
import NewUser from '../../components/NewUser'
import { catchHandler, showToast } from '../../utils/functions'
import staticData from '../../assets/staticData.json'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

const Users = () => {
  const toast = useRef(null)
  const { user } = useSelector((state) => state.auth)

  const [users, setUsers] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectedAccess, setAccess] = useState(null)
  const [selectedAccessArea, setAccessArea] = useState(null)
  const [selectedAccessLevel, setAccessLevel] = useState(null)
  const [selectedUser, setUser] = useState({
    name: '',
    email: '',
    access: '',
    area: '',
    access_level: '',
    access_area: '',
    last_updated: '',
    updated_by: '',
    created: '',
    created_by: ''
  })

  useEffect(() => {
    return fetchtUsers()
  }, [])

  const token = user ? user.token : 'token'
  const name = user ? user.name : 'Admin'

  const fetchtUsers = () => {
    axios
      .get(`${API_URL}/users`, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        setUser(res.data.data[0])
        setUsers(res.data.data)
        setAccess(res.data.data[0].access)
        setAccessArea(res.data.data[0].areaId)
        setAccessLevel(res.data.data[0].role)
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  const updateUser = () => {
    const data = {
      access: selectedAccess,
      areaId: selectedAccessArea,
      role: selectedAccessLevel,
      user: name
    }

    axios
      .put(`${API_URL}/users/${selectedUser.id}`, data, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        showToast('success', 'Success', 'User updated successfully', toast)
        fetchtUsers()
      })
      .catch(() => {
        catchHandler('Error updating user', toast)
      })
  }

  const actionBodyTemplate = (userId) => {
    return (
      <div className="flex align-items-center">
        <Button label="Manage" onClick={() => selectUser(userId)} size="small" />
      </div>
    )
  }

  const selectUser = (userData) => {
    const user = users.find((user) => user.id === userData.id)
    setUser(user)
    setAccess(user.access)
    setAccessArea(user.areaId)
    setAccessLevel(user.role)
  }

  return (
    <div className="max-h-screen overflow-hidden">
      <Navbar activeIndex={1} />
      <Toast ref={toast} />

      <div className="flex mt-3 h-max-h-full">
        {/* Table div */}
        <div className="w-8 px-3 ">
          <DataTable
            value={users}
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
            <Column field="access" sortable header="Access" />
            <Column field="area" sortable header="Area" />
            <Column header="Action" body={actionBodyTemplate} />
          </DataTable>
        </div>

        {/* Right div */}
        <div className="flex flex-column w-4 px-3">
          <Button onClick={() => setVisible(true)} className="add text-center mt-1 mb-2">
            Add new user
          </Button>

          <Card className="sidebar">
            {imageBodyTemplate(selectedUser)}

            <div className="mt-4">
              <div className="flex flex-column gap-2 text-left">
                <label htmlFor="username">Access:</label>
                <Dropdown
                  value={selectedAccess}
                  onChange={(e) => setAccess(e.value)}
                  options={staticData.access}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Access"
                  className="w-full p-inputtext-sm"
                />
              </div>

              <div className="flex flex-column gap-2 text-left mt-3">
                <label htmlFor="username">Access Level:</label>
                <Dropdown
                  value={selectedAccessLevel}
                  onChange={(e) => setAccessLevel(e.value)}
                  options={staticData.accessLevel}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Access Level"
                  className="w-full p-inputtext-sm"
                />
              </div>

              <div className="flex flex-column gap-2 text-left mt-3">
                <label htmlFor="username">Access Area:</label>
                <Dropdown
                  value={selectedAccessArea}
                  onChange={(e) => setAccessArea(e.value)}
                  options={staticData.accessArea}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Access Area"
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
                          <p className="m-0  mt-4 font-bold">{selectedUser.last_updated}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="m-0">Updated by:</p>
                        </td>
                        <td>
                          <p className="m-0 font-bold">{selectedUser.updated_by}</p>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <p className="m-0 mt-4">Created:</p>
                        </td>
                        <td>
                          <p className="m-0  mt-4 font-bold">{selectedUser.created}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>Created by:</td>
                        <td>
                          <p className="m-0 font-bold">{selectedUser.created_by}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-3 flex justify-content-end">
                <Button className="w-full" label="Save" size="small" onClick={updateUser} />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <NewUser visible={visible} setVisible={setVisible} toastRef={toast} refresh={fetchtUsers} />
    </div>
  )
}

export default Users

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
        <Badge
          severity={
            user.access === 'granted' ? 'success' : user.access === 'blocked' ? 'warning' : 'danger'
          }
        />
      </Avatar>
      <div className="ml-2">
        <p className="font-bold m-0 p-0">{user.name}</p>
        <p className="text-sm m-0 p-0">{user.email}</p>
      </div>
    </div>
  )
}
