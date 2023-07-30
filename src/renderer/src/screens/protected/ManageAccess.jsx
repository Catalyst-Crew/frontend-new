import { useState } from 'react'

import { Dropdown } from 'primereact/dropdown'

export default function ManageAccess() {
  const [selectedAccess, setAccess] = useState(null)
  const access = [
    { status: 'True', code: 'T' },
    { status: 'False', code: 'F' }
  ]
  const [selectedAccessArea, setAccessArea] = useState(null)
  const accessLevelArea = [
    { Area: 'SHAFT-1', code: 'S1' },
    { Area: 'SHAFT-2', code: 'S2' },
    { Area: 'West-Wing', code: 'WW' }
  ]

  return (
    <div>
      <h1 className="manageruser">Manage Sensor</h1>
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
            options={accessLevelArea}
            optionLabel="Area"
            placeholder="Area"
            className="w-full md:w-14rem"
          />
        </div>
      </div>
    </div>
  )
}
