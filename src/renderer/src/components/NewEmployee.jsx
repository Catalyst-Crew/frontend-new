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

function NewEmployee({ visible, setVisible, toastRef, refresh }) {
  const [loading, setLoading] = useState(false)
  const [selectedShift, setShift] = useState(null)
  const [userData, setUserData] = useState({ name: '', surname: '', email: '' })

  // get  user data from redux
  const { user } = useSelector((state) => state.auth)

  const userId = user ? user.id : 'USER-9b140f6b-dd5d-4f1a-b8be-6700164a0522'
  const username = user ? user.name : 'Admin'
  const token = user ? user.token : 'token'

  const handleNewEmployee = () => {
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
    if (!selectedShift) {
      showToast('error', 'Error', 'Shift is required', toastRef)
      return setLoading(false)
    }
    // if (!selectedShiftLevel) {
    //   showToast("error", "Error", "Access Level is required", toastRef)
    //   return setLoading(false);
    // }
    // if (!selectedShiftArea) {
    //   showToast("error", "Error", "Access Area is required", toastRef)
    //   return setLoading(false);
    // }

    axios
      .post(
        `${API_URL}/miners/create`,
        {
          name: `${userData.name} ${userData.surname}`,
          email: userData.email,
          username,
          shift: selectedShift,
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
        showToast('error', 'Error', res.data.message, toastRef)
      })
      .catch((err) => {
        catchHandler(err, toastRef)
      })
      .finally(() => {
        setLoading(false)
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
        onClick={handleNewEmployee}
        autoFocus
        loading={loading}
      />
    </div>
  )

  return (
    <Dialog
      header="New Miner Registration"
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
                <label htmlFor="email">Miner Email:</label>
                <InputText
                  id="email"
                  aria-describedby="name-help"
                  className="p-inputtext-sm"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
            </td>
            <td>
              <div className=" align-items-center mt-6 p-inputtext-sm">
                <p className="m-0 pl-3">Miner has no email </p>
                <Button
                  link
                  size="small"
                  severity="info"
                  onClick={() => setUserData({ ...userData, email: user.email })}
                >
                  Use default
                </Button>{' '}
              </div>
            </td>
          </tr>

          <tr>
            <td>
              {' '}
              <div className="mt-4">
                <div className="flex flex-column gap-2 text-left">
                  <label htmlFor="username">Shift:</label>
                  <Dropdown
                    value={selectedShift}
                    onChange={(e) => setShift(e.value)}
                    options={staticData.shift}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Select miner shift"
                    className="w-full p-inputtext-sm"
                  />
                </div>

                {/* <div className="flex flex-column gap-2 text-left mt-3">
                <label htmlFor="username">Access Level:</label>
                <Dropdown
                  value={selectedShiftLevel}
                  onChange={(e) => setShiftLevel(e.value)}
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
                  value={selectedShiftArea}
                  onChange={(e) => setShiftArea(e.value)}
                  options={staticData.accessArea}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select Access Area"
                  className="w-full p-inputtext-sm"
                />
              </div> */}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Dialog>
  )
}

import PropTypes from 'prop-types'
NewEmployee.propTypes = {
  visible: PropTypes.bool,
  user: PropTypes.object,
  setVisible: PropTypes.func,
  refresh: PropTypes.func,
  toastRef: PropTypes.object
}

export default NewEmployee
