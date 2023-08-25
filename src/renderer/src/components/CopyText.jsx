import { Button } from 'primereact/button'
import PropTypes from 'prop-types'

const CopyText = ({ text, className, label }) => {
  const copyText = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Button
      icon="pi pi-copy"
      label={label ? label : text}
      iconPos="right"
      onClick={copyText}
      text
      className={`p-0 m-0 ${className}`}
    />
  )
}

CopyText.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string
}

export default CopyText
