export const showToast = (severity, summary, detail, toastRef) => {
  toastRef.current.show({ severity, summary, detail })
}

export const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/)

export const emailRegex = new RegExp(/\S+@\S+\.\S+/)

export const catchHandler = (error, toastRef) => {
  try {
    showToast('error', 'Error', error.response.data.message, toastRef)
  } catch (err) {
    showToast('error', 'Error', error.message, toastRef)
  }
}
