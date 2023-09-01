import axios from 'axios'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'

import { Toast } from 'primereact/toast'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'

import Navbar from '../../components/Navbar'
import { ADMIN_ROLE, API_URL } from '../../utils/exports'
import CopyText from '../../components/CopyText'
import { catchHandler, showToast } from '../../utils/functions'

const Logs = () => {
  const toast = useRef(null)
  const MESSAGE_LENGTH = 70
  const { user } = useSelector((state) => state.auth)

  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedRow, setExpandedRow] = useState(null)
  const [selectedLogs, setSelectedLogs] = useState([])

  const token = user ? user.token : 'token'
  const name = user ? user.id : 999_999

  useEffect(() => {
    return fetchLogs()
  }, [])

  const handleDownloadRequest = () => {
    const arrayOfIds = selectedLogs.map((obj) => obj.id)
    setIsLoading(true)

    axios({
      url: `${API_URL}/logs/${name}`,
      method: 'POST',
      responseType: 'blob',
      data: {
        selection: arrayOfIds
      },
      timeout: 300_000,
      headers: { 'x-access-token': token }
    })
      .then(async (response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', `${name}-logs-${Date.now()}.csv`)

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

  const fetchLogs = () => {
    if (user.user_role_id == ADMIN_ROLE) {
      if (localStorage.getItem('logsData')) {
        setLogs(JSON.parse(localStorage.getItem('logsData')));
      }

      setIsLoading(true)
      axios
        .get(`${API_URL}/logs`, { headers: { 'x-access-token': token } }) // 5 minutes timeout
        .then((response) => {
          setLogs(response.data)
          localStorage.setItem('logsData', JSON.stringify(response.data));
        })
        .catch((error) => {
          catchHandler(error, toast)
        })
        .finally(() => setIsLoading(false))
    }
  }

  const paginatorLeft = (
    <Button loading={isLoading} type="button" icon="pi pi-refresh" text onClick={fetchLogs} />
  )

  const paginatorRight = (
    <Button
      loading={isLoading}
      type="button"
      icon="pi pi-download"
      text
      onClick={handleDownloadRequest}
    />
  )

  const allowExpansion = (rowData) => rowData.message.length > MESSAGE_LENGTH

  const messageColTemplate = (data) => {
    const message = data.message
    return (
      <p className="m-0">
        {message.length > MESSAGE_LENGTH ? `${message.substring(0, MESSAGE_LENGTH)}...` : message}
      </p>
    )
  }
  const header = (
    <div className="flex flex-wrap justify-content-between gap-2">
      <div className="flex flex-wrap gap-2">
        <h3 className="">Logs Table</h3>
      </div>
      <div className="flex flex-wrap justify-content-end gap-2">
        <Button
          loading={isLoading}
          icon="pi pi-minus"
          label="Collapse All"
          onClick={() => setExpandedRow(null)}
          text
        />
      </div>
    </div>
  )

  return (
    <div>
      <Navbar activeIndex={5} />
      <Toast ref={toast} />
      <div style={{ height: '80vh' }}>
        <DataTable
          rows={50}
          paginator
          scrollable
          stripedRows
          size="small"
          dataKey="id"
          value={logs}
          showGridlines
          removableSort
          sortOrder={-1}
          header={header}
          sortMode="multiple"
          sortField="created_at"
          selectionMode="checkbox"
          selection={selectedLogs}
          expandedRows={expandedRow}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          scrollHeight="calc(100vh - 14rem)"
          rowsPerPageOptions={[50, 100, 250, 500]}
          onRowToggle={(e) => setExpandedRow(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          onSelectionChange={(e) => setSelectedLogs(e.value)}
          virtualScrollerOptions={{}} //left empty on purpose
        >
          <Column expander={allowExpansion} style={{ width: '1rem' }} />
          <Column field="id" selectionMode="multiple" style={{ width: '2rem' }} />
          {/* <Column field="generatee_id" filter filterPlaceholder="Search by id" header="Generatee Id" headerStyle={{ maxWidth: "5vw" }} /> */}
          <Column
            field="loger_name"
            filter
            filterPlaceholder="Search by name"
            sortable
            header="By"
            headerStyle={{ width: '20vw' }}
          />
          <Column
            field="created_at"
            filter
            filterPlaceholder="Search by date"
            sortable
            sortField="created_at"
            header="Timestamp"
            headerStyle={{ width: '20vw' }}
            body={(e) => <>{moment(e.created_at).format('LLL')}</>}
          />
          <Column
            field="message"
            filter
            filterPlaceholder="Search by message"
            header="Message"
            body={messageColTemplate}
          />
        </DataTable>
      </div>
    </div>
  )
}

export default Logs

const rowExpansionTemplate = (data) => {
  return (
    <table className="table my-3 mx-4">
      <tbody>
        <tr>
          <td className="p-2 font-bold ">Generatee Id:</td>
          <td className="p-2 font-italic">
            <CopyText text={data.loger_id} />
          </td>
        </tr>
        <tr>
          <td className="p-2 font-bold">Message:</td>
          <td className="p-2">{data.message}</td>
        </tr>
      </tbody>
    </table>
  )
}
