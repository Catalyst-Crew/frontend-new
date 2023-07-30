import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'

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
    name: '',
    useremail: '',
    phone: '',
    app: 1,
    email: 1,
    mode: 1
  })

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (user) {
      setSettings({
        id: user.id,
        name: user.name,
        useremail: user.email,
        phone: user.phone
      })
    }

    return getUserSettings()
  }, [])

  const userId = user ? user.id : 'id'
  const token = user ? user.token : 'token'

  const getUserSettings = () => {
    axios
      .get(`${API_URL}/settings/${userId}`, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        setSettings({
          ...settings,
          app: res.data.data.app,
          email: res.data.data.email,
          mode: res.data.data.darkMode
        })
        localStorage.setItem('settings', JSON.stringify(res.data.data))
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  const updateUserSettings = () => {
    const data = {
      app: settings.app,
      email: settings.email,
      darkMode: settings.mode
    }

    axios
      .put(`${API_URL}/settings/${userId}`, data, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
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

    axios
      .put(`${API_URL}/users/${userId}`, data, { headers: { 'x-access-token': token } })
      .then((res) => {
        if (res.status !== 200) {
          return
        }
        showToast('success', 'Success', res.data.message, toast)
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
  }

  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <Toast ref={toast} />
      <div className="overflow-scroll mt-3" style={{ height: '95vh' }}>
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
                  value={settings.name}
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="name">Full Name:</label>
                <InputText
                  id="name"
                  className="p-inputtext-sm"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="Email">Email:</label>
                <InputText
                  id="Email"
                  className="p-inputtext-sm"
                  disabled
                  value={settings.useremail}
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="Phone">Phone number:</label>
                <InputText
                  id="Phone"
                  className="p-inputtext-sm"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
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
                value={settings.app}
                onChange={(e) => setSettings({ ...settings, app: e.value })}
                options={staticData.switchState}
                optionLabel="status"
                optionValue="code"
                placeholder="Status"
                className="w-full md:w-14rem"
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="email">Email Notifications:</label>
              <Dropdown
                id="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.value })}
                options={staticData.switchState}
                optionLabel="status"
                optionValue="code"
                placeholder="Status"
                className="w-full md:w-14rem"
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="mode">Dark Mode:</label>
              <Dropdown
                id="mode"
                value={settings.mode}
                onChange={(e) => setSettings({ ...settings, mode: e.value })}
                options={staticData.switchState}
                optionLabel="status"
                optionValue="code"
                placeholder="Status"
                className="w-full md:w-14rem"
              />
            </div>
            <Button
              label="Save"
              className="p-button-raised p-button-rounded"
              onClick={updateUserSettings}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings
