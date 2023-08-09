import moment from 'moment'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const DateTime = ({ format = 'dddd, MMMM Mo, YYYY, h:mm:ss A', className = '' }) => {
  const [date, setDate] = useState(new Date().toString())

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date().toString()), 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  })

  return <time className={className}>{moment(date).format(format)}</time>
}

DateTime.propTypes = {
  format: PropTypes.string,
  className: PropTypes.string
}

export default DateTime

// Path: src\renderer\src\components\DateTime.jsx
