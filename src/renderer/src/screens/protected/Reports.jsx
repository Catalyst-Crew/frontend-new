import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'

import axios from 'axios'
import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'

import Navbar from '../../components/Navbar'
import { API_URL } from '../../utils/exports'
import { catchHandler, showToast } from '../../utils/functions'

const Reports = () => {
  //const conponentPDF = useRef()
  const toast = useRef(null)
  const [reports, setReports] = useState([])

  const { user } = useSelector((state) => state.auth)

  const token = user ? user.token : 'token'
  const name = user ? user.id_prefix + user.id : 'user-999999'

  useEffect(() => {
    getReports()
  }, [])

  const getReports = () => {
    axios
      .get(`${API_URL}/users`, { headers: { 'x-access-token': token } })
      .then((res) => setReports(res.data.data))
      .catch((error) => catchHandler(error))
  }

  const downloadReport = (id) => {
    axios
      .get(`${API_URL}/reports/${id}`, {
        headers: { 'x-access-token': token },
        responseType: 'blob'
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', `${name}-report-${Date.now()}.csv`)

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        showToast('success', 'Success', 'Download complete.', toast)
      })
      .catch((error) => catchHandler(error))
  }

  return (
    <div>
      <Navbar activeIndex={4} />
      <Toast ref={toast} />

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h5 className="mt-2">User List</h5>
            <div
              // ref={conponentPDF}
              style={{ width: '100%' }}
            >
              <table className="table table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{report.user_name}</td>
                      <td>{report.email}</td>
                      <td>
                        <Button
                          className="btn btn-danger"
                          onClick={() => downloadReport(report.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-grid d-md-flex justify-content-md-end mb-3"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
