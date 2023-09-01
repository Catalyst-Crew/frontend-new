import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'

import Navbar from '../../components/Navbar'
import NewUser from '../../components/NewUser'
import username from '../../components/UserName'
import staticData from '../../assets/staticData.json'
import { ADMIN_ROLE, API_URL } from '../../utils/exports'
import { catchHandler, showToast } from '../../utils/functions'

import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

const Users = () => {
  const toast = useRef(null)
  const { user } = useSelector((state) => state.auth)

  const [users, setUsers] = useState([
    {
      user_id: 1000009,
      user_id_prefix: 'user-',
      user_name: 'Test Supervisor',
      role_id: 1000000,
      role_name: 'Admin',
      email: 'supervisor6@mail.com',
      created_by: 'axole',
      created_at: '2023-08-03T17:55:37.000Z',
      updated_by: 'axole',
      updated_at: '2023-08-03T17:55:37.000Z',
      phone: '',
      access_id: 1000000,
      access_name: 'Granted',
      area_id: 1000000
    }
  ])
  const [visible, setVisible] = useState(false)
  const [selectedAccess, setAccess] = useState(null)
  const [areas, setAreas] = useState([])
  const [selectedAccessArea, setAccessArea] = useState(null)
  const [selectedAccessLevel, setAccessLevel] = useState(null)
  const [selectedUser, setUser] = useState({
    user_id: 1000009,
    user_id_prefix: 'user-',
    user_name: 'Test Supervisor',
    role_id: 1000000,
    role_name: 'Admin',
    email: 'supervisor6@mail.com',
    created_by: 'axole',
    created_at: '2023-08-03T17:55:37.000Z',
    updated_by: 'axole',
    updated_at: '2023-08-03T17:55:37.000Z',
    phone: '',
    access_id: 1000000,
    access_name: 'Granted',
    area_id: 1000000
  })

  useEffect(() => {
    return fetchtUsers()
  }, [])


  const token = user ? user.token : 'token'
  const name = user ? user.id : 999_999

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

  const fetchtUsers = () => {
    if (localStorage.getItem('usersData')) {
      const data = JSON.parse(localStorage.getItem('usersData'));
      setUser(data[0])
      setUsers(data)
      setAccess(data[0].access_id)
      setAccessArea(data[0].access_id)
      setAccessLevel(data[0].role_id)
    }

    getAreas()

    axios
      .get(`${API_URL}/users`, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        const newData = res.data.data.filter((item) => item.user_id !== user.id)
        setUser(newData[0])
        setUsers(newData)
        setAccess(newData[0].access_id)
        setAccessArea(newData[0].access_id)
        setAccessLevel(newData[0].role_id)
        localStorage.setItem('usersData', JSON.stringify(res.data.data))

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
      .put(`${API_URL}/users/${selectedUser.user_id}`, data, {
        headers: { 'x-access-token': token }
      })
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
        <Button
          label="Manage"
          onClick={() => selectUser(userId)}
          size="small"
          disabled={user.user_role_id !== ADMIN_ROLE}
        />
      </div>
    )
  }

  const selectUser = (userData) => {
    const user = users.find((user) => user.user_id === userData.user_id)
    setUser(user)
    setAccess(user.access_id)
    setAccessArea(user.area_id)
    setAccessLevel(user.role_id)
  }

  return (
    <div className="overflow-hidden" style={{ height: '97vh' }}>
      <Navbar activeIndex={1} />
      <Toast ref={toast} />

      <div className="flex h-max-h-full">
        {/* Table div */}
        <div className="w-8 px-3 ">
          <DataTable
            value={users}
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
            <Column field="access_name" sortable header="Access" />
            <Column field="area_name" sortable header="Area" />
            <Column header="Action" body={actionBodyTemplate} />
          </DataTable>
        </div>

        {/* Right div */}
        <div className="flex flex-column w-4 px-3 gap-3">
          <Button
            onClick={() => setVisible(true)}
            className="add text-center mt-1 mb-2"
            disabled={user.user_role_id !== ADMIN_ROLE}
          >
            Add new user
          </Button>

          <Card className="sidebar">
            {username(selectedUser)}

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
                  options={areas}
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
                          <p className="m-0  mt-4 font-bold">
                            {moment(selectedUser.updated_at).format('LLL')}
                          </p>
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
                          <p className="m-0  mt-4 font-bold">
                            {moment(selectedUser.created_at).format('LLL')}
                          </p>
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
                <Button
                  className="w-full"
                  label="Save"
                  size="small"
                  onClick={updateUser}
                  disabled={user.user_role_id !== ADMIN_ROLE}
                />
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