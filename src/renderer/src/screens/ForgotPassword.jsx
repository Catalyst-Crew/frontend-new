import axios from 'axios'
import { useNavigate } from 'react-router'
import { useEffect, useRef, useState } from 'react'

import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Password } from 'primereact/password'
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'

import { API_URL } from '../utils/exports'
import { catchHandler, emailRegex, passwordRegex, showToast } from '../utils/functions'

const ForgotPassword = () => {
  const initialTime = 2 * 60 // 2 minutes
  const toast = useRef(null)
  const navigator = useNavigate()

  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPopUp, setShowPopUp] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(initialTime)
  const [disabled, setDisabled] = useState({ button: true, resend: true })

  useEffect(() => {
    let timerInterval = null

    if (timeRemaining > 0) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    } else {
      setDisabled({ ...disabled, resend: false })
      clearInterval(timerInterval)
    }

    return () => clearInterval(timerInterval)
  }, [timeRemaining, showPopUp])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const initialisePasswordReset = () => {
    setLoading(true)
    if (!email.match(emailRegex)) {
      showToast('error', 'Error', 'Invalid email', toast)
      return setLoading(false)
    }

    axios
      .get(`${API_URL}/auth/forgot-password/${email}`)
      .then((response) => {
        showToast('success', 'Success', response.data.message, toast)
        setShowPopUp(true)
      })
      .catch((error) => {
        catchHandler(error, toast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const resetPassword = () => {
    setLoading(true)
    if (!code || !password.match(passwordRegex)) {
      showToast('error', 'Error', 'Please fill all fields', toast)
      return setLoading(false)
    }

    const cleanCode = code.replace(/-/g, '')

    axios
      .patch(`${API_URL}/auth/forgot-password/${email}/${cleanCode}`, { password })
      .then((response) => {
        showToast('success', 'Success', response.data.message, toast)
        setCode('')
        setEmail('')
        setPassword('')
        setTimeout(() => {
          navigator('/')
        }, 1000)
      })
      .catch((error) => {
        catchHandler(error, toast)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div
      className="flex justify-content-center align-items-center align-content-center flex-column"
      style={{ height: '95vh' }}
    >
      <Toast ref={toast} />
      <div className="flex flex-column">
        <div className="flex flex-column align-items-center">
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password:</p>
          <div className="flex flex-column align-items-center">
            <span className="flex flex-column gap-2 w-20rem">
              {/* <label htmlFor="email">Email:</label> */}
              <InputText
                id="email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
              />
            </span>
          </div>
          <Button
            onClick={initialisePasswordReset}
            label="Submit"
            className="p-mt-2 mt-5 w-20rem"
            loading={loading}
          />
        </div>
      </div>

      <Button
        onClick={() => navigator('/')}
        text
        className="p-mt-2 mt-5"
        //loading={loading}
        label="Go to Login"
      />
      <Dialog
        header="Reset Password"
        visible={showPopUp}
        style={{ width: '30vw' }}
        onHide={() => setShowPopUp(false)}
      >
        <div className="flex flex-column align-items-center">
          <div className="flex flex-column mt-4 gap-2 w-7 align-items-center">
            <label htmlFor="code">Enter 6 digit code:</label>
            <InputMask
              id="code"
              value={code}
              className="text-center w-full ml-2"
              mask="**-**-**"
              slotChar="**-**-**"
              placeholder="**-**-**"
              onChange={(e) => {
                setCode(e.target.value)
                console.log(e.target.value)
              }}
            />
          </div>
          <div className="flex flex-column mt-4 gap-2 w-8 align-items-center">
            <label htmlFor="password">Enter new password:</label>
            <Password
              toggleMask
              id="password"
              type="password"
              value={password}
              className="text-center w-full"
              onChange={(e) => {
                setPassword(e.target.value)
                if (e.target.value.match(passwordRegex)) {
                  setDisabled({ ...disabled, button: false })
                }
              }}
            />
          </div>

          <Button
            label="Submit"
            className="p-mt-2 mt-5"
            loading={loading}
            onClick={resetPassword}
            disabled={disabled.button}
          />
          <div className="flex flex-column mt-4 gap-2 w-8 align-items-center">
            <Button
              text
              disabled={disabled.resend}
              onClick={() => {
                setTimeRemaining(initialTime)
                setDisabled({ ...disabled, resend: true })
                initialisePasswordReset()
              }}
              className="w-max"
            >
              Resend code: {formatTime(timeRemaining)}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ForgotPassword
