import axios from 'axios'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Dropdown } from 'primereact/dropdown'

import { API_URL } from '../utils/exports'
import staticData from '../assets/staticData.json'
import { catchHandler, showToast } from '../utils/functions'

export default function ManageAccess({ data, toastRef, token, username, refresh }) {
  const [selectedAccess, setAccess] = useState(null)

  useEffect(() => {
    if (data) {
      setAccess(data.active)
    }
  }, [data])

  const updateStatus = (status) => {
    setAccess(status)

    axios
      .put(
        `${API_URL}/access-points/${data.id}`,
        { status, username },
        {
          headers: { 'x-access-token': token }
        }
      )
      .then((response) => {
        showToast('success', 'Success', response.data.message, toastRef)
        refresh()
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
  }

  return (
    <Card title="Manage point" className="mb-2" subTitle={data?.id.substring(0, 10)}>
      <div className="card flex mt-3">
        <div className="flex flex-column gap-2 ml-2">
          <label htmlFor="access">Active:</label>
          <Dropdown
            value={selectedAccess}
            onChange={(e) => updateStatus(e.value)}
            options={staticData.switchState}
            optionLabel="status"
            placeholder="Status"
            optionValue="code"
            className="w-full md:w-14rem"
          />
        </div>
      </div>
    </Card>
  )
}

ManageAccess.propTypes = {
  data: PropTypes.object,
  toastRef: PropTypes.object,
  token: PropTypes.string,
  username: PropTypes.string,
  refresh: PropTypes.func
}
