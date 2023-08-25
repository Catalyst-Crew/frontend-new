import axios from 'axios'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'

import { API_URL } from '../utils/exports'
import staticData from '../assets/staticData.json'
import { catchHandler, emailRegex, showToast } from '../utils/functions'

function NewUser({ visible, setVisible, toastRef, refresh }) {
  const [loading, setLoading] = useState(false)
  const [selectedAccess, setAccess] = useState(null)
  const [selectedAccessLevel, setAccessLevel] = useState(null)
  const [selectedAccessArea, setAccessArea] = useState(null)
  const [userData, setUserData] = useState({ name: '', surname: '', email: '' })
  const [areas, setAreas] = useState([])

  // get  user data from redux
  const { user } = useSelector((state) => state.auth)

  const userId = user ? user.id : 1_000_001
  const username = user ? user.name : 'Admin'
  const token = user ? user.token : 'token'

  const handleNewUser = () => {
    setLoading(true)
    if (!userData.name || userData.name.length < 3) {
      showToast('error', 'Error', 'Name is required', toastRef)
      return setLoading(false)
    }
    if (!userData.surname || userData.surname.length < 3) {
      showToast('error', 'Error', 'Surname is required', toastRef)
      return setLoading(false)
    }
    if (!userData.email || !emailRegex.test(userData.email)) {
      showToast('error', 'Error', 'Email is required', toastRef)
      return setLoading(false)
    }
    if (!selectedAccess) {
      showToast('error', 'Error', 'Access is required', toastRef)
      return setLoading(false)
    }
    if (!selectedAccessLevel) {
      showToast('error', 'Error', 'Access Level is required', toastRef)
      return setLoading(false)
    }
    if (!selectedAccessArea) {
      showToast('error', 'Error', 'Access Area is required', toastRef)
      return setLoading(false)
    }

    axios
      .post(
        `${API_URL}/auth/register`,
        {
          name: `${userData.name} ${userData.surname}`,
          email: userData.email,
          role: selectedAccessLevel,
          user: username,
          access: selectedAccess,
          areaId: selectedAccessArea,
          userId
        },
        { headers: { 'x-access-token': token } }
      )
      .then((res) => {
        if (res.status === 200) {
          showToast('success', 'Success', res.data.message, toastRef)
          refresh()
          setVisible(false)
          return
        }
        showToast('warn', 'Attention', res.data.message, toastRef)
      })
      .catch((err) => {
        catchHandler(err, toastRef)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const getAreas = () => {
    axios
      .get(`${API_URL}/areas`, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        setAreas(res.data)
      })
      .catch((err) => {
        catchHandler(err, toastRef)
      })
  }

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        loading={loading}
        className="p-button-text"
      />
      <Button
        label="Procced"
        icon="pi pi-check"
        onClick={handleNewUser}
        autoFocus
        loading={loading}
      />
    </div>
  )

  return (
    <Dialog
      header="New User Registration"
      visible={visible}
      style={{ width: '50vw' }}
      onHide={() => setVisible(false)}
      footer={footerContent}
    >
      <table className="w-full">
        <tbody>
          <tr>
            <td>
              <div className="flex flex-column gap-2">
                <label htmlFor="name">Name:</label>
                <InputText
                  id="name"
                  aria-describedby="name-help"
                  className="p-inputtext-sm"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>
            </td>
            <td>
              <div className="flex flex-column gap-2">
                <label htmlFor="sname">Surname:</label>
                <InputText
                  id="sname"
                  aria-describedby="name-help"
                  className="p-inputtext-sm"
                  value={userData.surname}
                  onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div className="flex flex-column gap-2 mt-3">
                <label htmlFor="email">Emai:</label>
                <InputText
                  id="email"
                  aria-describedby="name-help"
                  className="p-inputtext-sm"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div className="mt-4">
                <div className="flex flex-column gap-2 text-left">
                  <label htmlFor="username">Access:</label>
                  <Dropdown
                    value={selectedAccess}
                    onChange={(e) => {
                      setAccess(e.value)
                      getAreas()
                    }}
                    options={[staticData.access[0], staticData.access[1]]}
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
                    options={areas.length > 0 ? areas : staticData.accessA}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select Access Area"
                    className="w-full p-inputtext-sm"
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Dialog>
  )
}

import PropTypes from 'prop-types'

NewUser.propTypes = {
  visible: PropTypes.bool,
  user: PropTypes.object,
  setVisible: PropTypes.func,
  refresh: PropTypes.func,
  toastRef: PropTypes.object
}

export default NewUser
