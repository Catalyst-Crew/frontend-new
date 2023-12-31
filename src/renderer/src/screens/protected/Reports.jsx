import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { Checkbox } from 'primereact/checkbox'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { FileUpload } from 'primereact/fileupload'

import axios from 'axios'
import moment from 'moment/moment'
import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'

import Navbar from '../../components/Navbar'
import { ADMIN_ROLE, API_URL } from '../../utils/exports'
import { catchHandler, showToast } from '../../utils/functions'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const Reports = () => {
  const toast = useRef(null)

  const [dates, setDates] = useState(null)
  const [reports, setReports] = useState([])
  const [fileName, setFileName] = useState('')
  const [checked, setChecked] = useState(false)
  const [reportType, setReportType] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useSelector((state) => state.auth)

  const token = user ? user.token : 'token'
  const name = user ? user.id : 999_999

  useEffect(() => {
    getReports()
  }, [])

  const getReports = () => {
    if (localStorage.getItem('reportsData')) {
      setReports(JSON.parse(localStorage.getItem('reportsData')))
    }
    setIsLoading(true)
    axios
      .get(`${API_URL}/reports`, { headers: { 'x-access-token': token } })
      .then((res) => {
        setReports(res.data)
        localStorage.setItem('reportsData', JSON.stringify(res.data))
      })
      .catch((error) => catchHandler(error, toast))
      .finally(() => setIsLoading(false))
  }

  const generateReport = () => {
    if (!reportType) {
      return showToast('error', 'Error', 'Please select a report type and date range.', toast)
    }
    setIsLoading(true)
    axios
      .post(
        `${API_URL}/reports/${reportType}`,
        {
          date_range: [
            moment(dates[0]).format('YYYY-MM-DD'),
            moment(dates[1]).format('YYYY-MM-DD')
          ],
          notify_user: checked,
          user_id: name
        },
        { headers: { 'x-access-token': token } }
      )
      .then((res) => {
        showToast('success', 'Success', res.data.message, toast)
      })
      .catch((error) => catchHandler(error))
      .finally(() => setIsLoading(false))
  }

  const downloadReport = (file_name) => {
    setIsLoading(true)
    axios
      .get(`${API_URL}/reports/${file_name}`, {
        headers: { 'x-access-token': token }
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', `${file_name}.csv`)

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        showToast('success', 'Success', 'Download complete.', toast)
      })
      .catch((error) => {
        catchHandler(error, toast)
      })
      .finally(() => setIsLoading(false))
  }

  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded
    const file = event.files[0]

    const blob = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    const base64EncodedFile = blob.replace(/^data:\w+\/\w+;base64,/, '')

    uploadReport(base64EncodedFile)
  }

  const uploadReport = (file) => {
    setIsLoading(true)
    axios
      .post(
        `${API_URL}/reports/upload/new`,
        { file, file_name: fileName, user_id: name },
        {
          headers: {
            'x-access-token': token
          }
        }
      )
      .then((res) => {
        showToast('success', 'Success', res.data.message, toast)
      })
      .catch((error) => {
        catchHandler(error, toast)
      })
      .finally(() => setIsLoading(false))
  }

  const paginatorLeft = (
    <Button
      id="refresh-Button"
      loading={isLoading}
      type="button"
      icon="pi pi-refresh"
      text
      onClick={getReports}
      accessKey="Shift+r"
    />
  )
  const paginatorRight = <></>

  return (
    <div className="max-h-screen overflow-hidden">
      <Navbar activeIndex={4} />
      <Toast ref={toast} />
      <div className="flex gap-4" style={{ height: '87vh' }}>
        <DataTable
          value={reports}
          rows={20}
          paginator
          scrollable
          stripedRows
          paginatorRight={paginatorRight}
          paginatorLeft={paginatorLeft}
          className="p-datatable-sm w-8"
          scrollHeight="calc(90vh - 5rem)"
          rowsPerPageOptions={[20, 50, 100]}
        >
          <Column field="id" header="ID" />
          <Column field="name" header="Generated By" />
          <Column field="file_name" header="File Name" />
          <Column
            field="created_at"
            header="Date"
            body={(rowData) => moment(rowData.created_at).format('Do MMM YYYY hh:mm')}
          />
          <Column
            field="download"
            header="Download"
            body={(rowData) => (
              <Button
                label="Download"
                className="p-button-sm p-button-outlined"
                onClick={() => downloadReport(rowData.file_name)}
                disabled={user.user_role_id !== ADMIN_ROLE}
              />
            )}
          />
        </DataTable>

        <div className="flex-column flex w-4 gap-3">
          <Card
            title="Generate a reports"
            className="w-full p-card-rounded p-card-plain p-mb-2"
            subTitle="Select a report to generate below. Please note this might take time to reflect back."
          >
            <div className="flex flex-column gap-3 pt-2">
              <Dropdown
                value={reportType}
                options={[
                  { label: 'Access Points', value: 'access_points' },
                  { label: 'Areas', value: 'areas' },
                  { label: 'Logs', value: 'logs' },
                  { label: 'Measurements', value: 'measurements' },
                  { label: 'Miners', value: 'miners' },
                  { label: 'Reports', value: 'reports' },
                  { label: 'Sensors', value: 'sensors' },
                  { label: 'Users', value: 'users' }
                ]}
                onChange={(e) => setReportType(e.value)}
                placeholder="Select a report to generate"
                className="p-inputtext-sm"
              />

              <Calendar
                value={dates}
                readOnlyInput
                dateFormat="yy-mm-dd"
                selectionMode="range"
                className="p-inputtext-sm"
                placeholder="Select a date range"
                onChange={(e) => setDates(e.value)}
              />
              <div className="flex align-items-center">
                <Checkbox
                  inputId="send_email"
                  onChange={(e) => setChecked(e.checked)}
                  checked={checked}
                  className="p-inputtext-sm"
                />
                <label htmlFor="send_email" className="ml-2">
                  Send me email notification when complete
                </label>
              </div>
              <Button
                label="Generate"
                className="p-button-sm p-button-filled mt-2"
                onClick={() => generateReport()}
                loading={isLoading}
                disabled={user.user_role_id !== ADMIN_ROLE}
              />
            </div>
          </Card>

          <Card
            title="Uplod a report"
            className="w-full p-card-rounded p-card-plain p-mb-2"
            subTitle="Upload a report below. Please note this might take time to reflect back."
          >
            <div className="flex flex-column gap-3">
              <div className="flex flex-column gap-2 mt-2">
                <label htmlFor="file_name">File Name:</label>
                <InputText
                  id="file_name"
                  aria-describedby="file-help"
                  className="p-inputtext-sm"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="my-report"
                />
              </div>
              <div className="flex flex-column gap-2 mt-2">
                <FileUpload
                  mode="basic"
                  customUpload
                  url={`${API_URL}/reports/upload`}
                  accept=".csv,application/vnd.ms-excel"
                  className="p-inputtext-sm"
                  maxFileSize={MAX_FILE_SIZE}
                  uploadHandler={customBase64Uploader}
                  onSelect={(e) => {
                    if (e.files[0].size > MAX_FILE_SIZE) {
                      return showToast('error', 'Error', 'File size is too large.', toast)
                    }
                    setFileName(e.files[0].name.split('.')[0])
                  }}
                  loading={isLoading}
                  onError={() => showToast('error', 'Error', 'Upload failed.', toast)}
                />
                <small id="file-help">Please upload CSV file only. Max file size is 10MB.</small>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-content-between">
              <div className="flex justify-content-between">
                <p className="m-0">Total files:</p>
                <p className="ml-5 m-0">{reports?.length || 0}</p>
              </div>
              <div className="flex justify-content-between">
                <p className="m-0">Current reports queue:</p>
                <p className="ml-5 m-0">{Math.floor(Math.random() * 1)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Reports
