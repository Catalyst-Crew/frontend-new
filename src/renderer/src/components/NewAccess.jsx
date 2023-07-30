//import  { useState } from 'react'
import PropTypes from 'prop-types'
import { Dialog } from 'primereact/dialog'

const NewAccess = ({ visible, user, setVisible, refresh, toastRef }) => {
  return (
    <Dialog
      header="Header"
      visible={visible}
      style={{ width: '50vw' }}
      onHide={() => setVisible(false)}
    >
      <p>Content</p>
    </Dialog>
  )
}

NewAccess.propTypes = {
  visible: PropTypes.bool,
  user: PropTypes.object,
  setVisible: PropTypes.func,
  refresh: PropTypes.func,
  toastRef: PropTypes.object
}

export default NewAccess
