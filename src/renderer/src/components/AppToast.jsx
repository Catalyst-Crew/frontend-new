import { useRef } from 'react'
import PropTypes from 'prop-types'

import { Toast } from 'primereact/toast'

const AppToast = ({ massage, type }) => {
  const toast = useRef(null)

  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: massage, life: 3000 })
  }

  const showError = () => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: massage, life: 3000 })
  }

  const showWarn = () => {
    toast.current.show({ severity: 'warn', summary: 'Error', detail: massage, life: 3000 })
  }

  return (
    <>
      <Toast ref={toast} />
      {type === 'success' ? showSuccess() : type === 'error' ? showError() : showWarn()}
    </>
  )
}

AppToast.propTypes = {
  massage: PropTypes.string,
  type: PropTypes.string
}

export default AppToast
