import { useState } from 'react'
import { Dropdown } from 'primereact/dropdown'

export default function ManageSensor() {
  const [selectedAccess, setAccess] = useState(null)
  const access = [
    { status: 'True', code: 1 },
    { status: 'False', code: 0 }
  ]
  const [selectedAccessArea, setAccessArea] = useState(null)

  return (
    <div>
      <h1 className="DeleteUserTitle">Manage Sensor</h1>
      <div className="card flex justify-content-center">
        <div className="flex flex-column gap-2">
          <label htmlFor="access">Active:</label>
          <Dropdown
            value={selectedAccess}
            onChange={(e) => setAccess(e.value)}
            options={access}
            optionLabel="status"
            placeholder="Status"
            className="w-full md:w-14rem"
          />
          <br />
          <label htmlFor="reason">Area:</label>
          <Dropdown
            value={selectedAccessArea}
            onChange={(e) => setAccessArea(e.value)}
            options={access}
            optionLabel="Area"
            placeholder="Area"
            className="w-full md:w-14rem"
          />
        </div>
      </div>
    </div>
  )
}
