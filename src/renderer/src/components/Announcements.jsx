import axios from 'axios'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

import { Panel } from 'primereact/panel'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { InputText } from 'primereact/inputtext'
import { ScrollPanel } from 'primereact/scrollpanel'
import { InputTextarea } from 'primereact/inputtextarea'

import { API_URL } from '../utils/exports'
import { catchHandler, showToast } from '../utils/functions'
import { selectUser, selectUserToken } from '../store/store'

const Announcements = ({ visible, setVisible, toastRef }) => {
  const [messeges, setMessages] = useState([])
  const [showNewAnnD, setShowNewAnnD] = useState(false)
  const [newAnnData, setNewAnnData] = useState({
    ann_name: '',
    ann_message: ''
  })

  const user = useSelector(selectUser)
  const token = useSelector(selectUserToken)

  useEffect(() => {
    if (localStorage.getItem('announcements')) {
      const cachedData = JSON.parse(localStorage.getItem('announcements'))
      setMessages(cachedData)
    }

    getMessages()
  }, [])

  const getMessages = () => {
    axios
      .get(`${API_URL}/announcements`, {
        headers: { 'x-access-token': token }
      })
      .then((response) => {
        setMessages(response.data)
        localStorage.setItem('announcements', JSON.stringify(response.data))
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
  }

  const showNewAnn = () => setShowNewAnnD((prev) => !prev)

  const postNewAnn = () => {
    if (!newAnnData.ann_name) {
      return showToast('warn', 'Missing fields!', 'Announcement title is required.', toastRef)
    }
    if (!newAnnData.ann_message) {
      return showToast('warn', 'Missing fields!', 'Announcement message is required.', toastRef)
    }

    axios
      .post(
        `${API_URL}/announcements`,
        { ...newAnnData, ann_user_id: user },
        {
          headers: { 'x-access-token': token }
        }
      )
      .then((response) => {
        setNewAnnData({
          ann_name: '',
          ann_message: ''
        })
        getMessages()
        showToast('success', 'Success', response.data.message, toastRef)
        showNewAnn()
      })
      .catch((error) => {
        catchHandler(error, toastRef)
      })
  }

  return (
    <Dialog
      header={<Header handleClick={showNewAnn} hide={user.user_role_id === 1_000_000} />}
      visible={visible}
      style={{ width: '40vw' }}
      onHide={setVisible}
      position="top-right"
      draggable={false}
    >
      {messeges.length ? (
        <ScrollPanel style={{ height: '500px' }}>
          {
            <ul className="list-none p-0 m-0">
              {messeges.map((data) => (
                <Announcement announcement={data} key={data.name} />
              ))}
            </ul>
          }
        </ScrollPanel>
      ) : (
        <p>No new announcements</p>
      )}
      <Dialog
        header="Post new announcement"
        visible={showNewAnnD}
        onHide={showNewAnn}
        draggable={false}
        position="center"
        style={{ width: '40vw' }}
      >
        <div className="flex flex-column gap-4">
          <div className="flex flex-column gap-2">
            <label htmlFor="title">Title:</label>
            <InputText
              id="title"
              value={newAnnData.ann_name}
              onChange={(e) => setNewAnnData((prev) => ({ ...prev, ann_name: e.target.value }))}
            />
          </div>
          <div className="flex flex-column gap-2">
            <label htmlFor="message">Message:</label>
            <InputTextarea
              id="message"
              rows={10}
              value={newAnnData.ann_message}
              onChange={(e) => setNewAnnData((prev) => ({ ...prev, ann_message: e.target.value }))}
            />
          </div>

          <Button label="Post" onClick={postNewAnn} />
        </div>
      </Dialog>
    </Dialog>
  )
}

Announcements.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  toastRef: PropTypes.object
}

export default Announcements

const Announcement = ({ announcement }) => {
  let name

  if (announcement.user_name.includes(' ')) {
    const nameArr = announcement.user_name.split(' ')
    name = nameArr[0][0] + nameArr[1][0]
  } else {
    name = announcement.user_name.substring(0, 2)
  }

  return (
    <li>
      <div className="flex flex-column">
        <div className="flex gap-3">
          <Avatar
            size="large"
            label={name.toUpperCase()}
            style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
            shape="circle"
          />
          <Panel collapsed={true} toggleable={true} header={announcement.name} className="w-full">
            <p className="m-0 p-0">{announcement.message}</p>
            <p className="mb-0 font-italic">Posted by: {announcement.user_name}</p>
          </Panel>
        </div>
        <div className="flex gap-2 mt-2">
          <p className="m-0 ml-7">{moment(announcement.created_at).fromNow()}</p>
        </div>
      </div>{' '}
      <hr className="border-200" />
    </li>
  )
}

const Header = ({ handleClick, hide }) => (
  <div className="flex gap-2 align-items-center">
    <h4 className="m-0 p-0">Announcements</h4>
    <Button
      onClick={handleClick}
      severity="secondary"
      size="small"
      text
      label="Add new"
      disabled={hide}
    />
  </div>
)

Header.propTypes = {
  handleClick: PropTypes.func,
  hide: PropTypes.bool
}

Announcement.propTypes = {
  announcement: PropTypes.object
}
