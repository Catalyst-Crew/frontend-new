import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { ScrollPanel } from 'primereact/scrollpanel'
import { InputSwitch } from 'primereact/inputswitch'

import Navbar from '../../components/Navbar'
import { API_URL } from '../../utils/exports'
import staticData from '../../assets/staticData.json'
import { catchHandler, showToast } from '../../utils/functions'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'

const Settings = () => {
  const toast = useRef(null)
  const [settings, setSettings] = useState({
    id: '',
    name: 'Axole Maranjana',
    email: 'axolemaranjana4@gmail.com',
    phone: '',
    app_notifications: 1,
    email_notifications: 1,
    dark_mode: 0
  })
  const [checked, setChecked] = useState(false)

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (localStorage.getItem('audio_alerts')) {
      setChecked(JSON.parse(localStorage.getItem('audio_alerts')))
    }
    if (user) {
      setSettings({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      })
    }
    getUserSettings()
  }, [user])

  const id = user ? user.id : 1_000_000
  const token = user ? user.token : 'token'

  const getUserSettings = () => {
    if (localStorage.getItem('settings')) {
      setSettings((prev) => ({
        ...prev,
        ...JSON.parse(localStorage.getItem('settings'))
      }))
    }
    axios
      .get(`${API_URL}/settings/${id}`, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        console.log(res.data)
        setSettings((prev) => ({
          ...prev,
          ...res.data
        }))
        localStorage.setItem('settings', JSON.stringify(res.data))
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  const updateUserSettings = () => {
    axios
      .put(`${API_URL}/settings/${id}`, settings, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        getUserSettings()
        showToast('success', 'Success', res.data.message, toast)
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  const updateUser = () => {
    const data = {
      name: settings.name,
      phone: settings.phone
    }

    if (data.name === '' || data.phone === '') {
      showToast('error', 'Error', 'Please fill in all fields.', toast)
      return
    }

    if (data.phone.length !== 11) {
      showToast('error', 'Error', 'Please enter a valid phone number.', toast)
      return
    }

    if (data.name.length < 3) {
      showToast('error', 'Error', 'Please enter a valid name.', toast)
      return
    }

    axios
      .put(`${API_URL}/users/update/${id}`, data, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        getUserSettings()
        showToast('success', 'Success', res.data.message, toast)
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  return (
    <div className=" max-h-screen">
      <Navbar />
      <Toast ref={toast} />
      <ScrollPanel style={{ width: '100%', height: '88vh' }}>
        <Card title="User Setings" subTitle="Update your setting here." className="sidebar">
          <div className="mt-3">
            <div className="flex flex-column gap-4 w-4 pl-5 pb-3">
              <div className="flex flex-column gap-2">
                <label htmlFor="id">User ID:</label>
                <InputText
                  id="id"
                  aria-describedby="id-help"
                  className="p-inputtext-sm"
                  disabled
                  value={user?.identity}
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="name">Full Name:</label>
                <InputText
                  id="name"
                  className="p-inputtext-sm"
                  value={settings.name}
                  onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="Email">Email:</label>
                <InputText id="Email" className="p-inputtext-sm" disabled value={settings.email} />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="Phone">Phone number:</label>
                <InputText
                  id="Phone"
                  className="p-inputtext-sm"
                  value={settings.phone}
                  maxLength={11}
                  minLength={11}
                  placeholder="27687654320"
                  onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <Button
                label="Save"
                className="p-button-raised p-button-rounded"
                onClick={updateUser}
              />
            </div>
          </div>
        </Card>
        <Card title="App settings" subTitle="Customise your preferences here." className="mt-5">
          <div className="flex flex-column gap-4 w-4 pl-5 mb-3 pt-3">
            <div className="flex flex-column gap-2">
              <label htmlFor="app">App Notifications:</label>
              <Dropdown
                id="app"
                value={settings.app_notifications}
                onChange={(e) => setSettings({ ...settings, app_notifications: e.value })}
                options={staticData.switchState}
                optionLabel="name"
                optionValue="status"
                placeholder="On"
                className="w-full md:w-14rem"
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="email">Email Notifications:</label>
              <Dropdown
                id="email"
                value={settings.email_notifications}
                onChange={(e) => setSettings({ ...settings, email_notifications: e.value })}
                options={staticData.switchState}
                optionLabel="name"
                optionValue="status"
                placeholder="On"
                className="w-full md:w-14rem"
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="mode">Dark Mode:</label>
              <Dropdown
                id="mode"
                value={settings.dark_mode}
                onChange={(e) => setSettings({ ...settings, dark_mode: e.value })}
                options={staticData.switchState}
                optionLabel="name"
                optionValue="status"
                placeholder="Off"
                className="w-full md:w-14rem"
              />
            </div>
            <Button
              label="Save"
              className="p-button-raised p-button-rounded"
              onClick={updateUserSettings}
            />

            <br />

            <div className="flex flex-column gap-2">
              <label htmlFor="mode">Audio Alerts:</label>
              <InputSwitch
                checked={checked}
                onChange={(e) => {
                  setChecked(e.value)
                  localStorage.setItem('audio_alerts', JSON.stringify(e.value))
                }}
              />
            </div>
          </div>
        </Card>
      </ScrollPanel>
    </div>
  )
}

export default Settings
