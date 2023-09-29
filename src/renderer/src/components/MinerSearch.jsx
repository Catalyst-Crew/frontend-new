import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'

import { selectAccessPoints } from '../store/store'
import { setFocusedAccesspoint } from '../store/features/dashboadSlice'

function MinerSearch({ show, setShow }) {
  const dispatch = useDispatch()
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])

  const accessPoints = useSelector(selectAccessPoints)

  const search = (term) => {
    setTerm(term)

    if (term.length < 2) {
      setResults([])
      return
    }

    const measurements = accessPoints?.filter((ap) => ap.measurements !== null)
    const tempresults = []
    measurements.forEach((ap) => {
      ap.measurements.forEach((mea) => {
        if (mea.miner_name.toLowerCase().includes(term.toLowerCase())) {
          tempresults.push({ ...mea, location: ap, measurements: '' })
        }
      })
    })
    setResults(tempresults)
  }

  return (
    <Dialog
      header="Search for a miner"
      visible={show}
      style={{ height: '80vh' }}
      onHide={() => setShow(false)}
      position="right"
      maximizable
      modal={false}
      draggable={false}
    >
      <div className="w-full overflow-hidden">
        <div className="flex gap-2 align-items-center">
          <label htmlFor="name">Name:</label>
          <InputText
            id="name"
            aria-describedby="name-help"
            className="p-inputtext-sm"
            onChange={(e) => search(e.target.value)}
          />
        </div>
        <div>
          <h4>Results:</h4>
          {results.length > 0 ? (
            results.map((miner) => {
              return (
                <table
                  key={miner.id}
                  className="text-left mb-3 search-card p-2"
                  onClick={() => {
                    dispatch(setFocusedAccesspoint(miner.access_point_id))
                  }}
                >
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td className="pl-4">{miner.miner_name}</td>
                    </tr>
                    <tr>
                      <th>AP Name:</th>
                      <td className="pl-4">{miner.location.access_point_name}</td>
                    </tr>
                    <tr>
                      <th>Area Name:</th>
                      <td className="pl-4">{miner.location.area_name}</td>
                    </tr>
                  </tbody>
                </table>
              )
            })
          ) : term.length > 1 ? (
            <p>No results for {term}</p>
          ) : (
            <p>Start typing to see some results</p>
          )}
        </div>
      </div>
    </Dialog>
  )
}

MinerSearch.propTypes = {
  show: PropTypes.bool,
  setShow: PropTypes.func
}

export default MinerSearch
