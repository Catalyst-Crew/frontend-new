import { Dialog } from 'primereact/dialog'
import PropTypes from 'prop-types'

const NewSensor = ({ visible, user, setVisible, refresh, toastRef }) => {
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

NewSensor.propTypes = {
  visible: PropTypes.bool,
  user: PropTypes.object,
  setVisible: PropTypes.func,
  refresh: PropTypes.func,
  toastRef: PropTypes.object
}

export default NewSensor
