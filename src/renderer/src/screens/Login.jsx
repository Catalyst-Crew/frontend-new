import axios from 'axios'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'

import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

import { API_URL } from '../utils/exports'
import DateTime from '../components/DateTime'
import { login } from '../store/features/authSlice'
import { catchHandler, showToast } from '../utils/functions'

const Login = () => {
  const toast = useRef(null)
  const dispatch = useDispatch()
  const navigator = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)

    if (!username) {
      showToast('error', 'Error', 'Email is required', toast)
      setLoading(false)
      return
    }
    if (!password) {
      showToast('error', 'Error', 'Password is required', toast)
      setLoading(false)
      return
    }

    axios
      .post(`${API_URL}/auth`, { email: username, password })
      .then((res) => {
        if (res.status === 200) {
          showToast('success', 'Success', res.data.message, toast)
          dispatch(login({ user: res.data.data, state: true }))
        } else {
          showToast('error', 'Error', res.data.message, toast)
        }
      })
      .catch((err) => {
        catchHandler(err, toast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="flex align-items-center align-content-center" style={{ height: '95vh' }}>
      <div className="flex flex-column w-full text-center">
        <Toast ref={toast} />
        <DateTime />

        <h1>Login</h1>
        <p className="m-4">Welcome back! Please enter your details.</p>

        <div className="card column justify-content-center w-4 mx-auto">
          <div className="flex flex-column gap-2 text-left">
            <label htmlFor="username">Email</label>
            <InputText
              className="p-inputtext-sm"
              placeholder="Enter your email"
              type="email"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-column gap-2 text-left mt-5">
            <label htmlFor="username">Password</label>
            <InputText
              className="p-inputtext-sm"
              placeholder="********"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <small id="username-help">This is the password that was sent to your email.</small>
          </div>

          <Button
            loading={loading}
            type="submit"
            className="mt-4 w-full text-center"
            label="Sign in"
            onClick={handleSubmit}
          />

          <Button
            className="mt-4"
            onClick={() => navigator('/forgot-password')}
            label="Forgot your password?"
            text
          />
          <br />
          <Button
            className="mt-2"
            onClick={() => navigator('/help')}
            icon="pi pi-info-circle"
            link
            severity="info"
            rounded
            text
            raised
            aria-label="Information"
          />
        </div>
      </div>
    </div>
  )
}

export default Login
