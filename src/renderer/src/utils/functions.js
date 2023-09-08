import store from '../store/store'
import { logout } from '../store/features/authSlice'

export const showToast = (severity, summary, detail, toastRef) => {
  toastRef.current.show({ severity, summary, detail })
}

export const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/)

export const emailRegex = new RegExp(/\S+@\S+\.\S+/)

export const catchHandler = (error, toastRef) => {
  try {
    showToast('error', 'Error', error.response.data.message, toastRef)

    if (error?.response?.status && error?.response?.status === 401) {
      setTimeout(() => {
        store.dispatch(logout())
      }, 3000)
    }
  } catch (err) {
    showToast('error', 'Error', error.message, toastRef)
  }
}
