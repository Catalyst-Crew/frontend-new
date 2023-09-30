import axios from 'axios'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Image } from 'primereact/image'
import { Button } from 'primereact/button'
import { TabMenu } from 'primereact/tabmenu'

import IconImage from '../assets/images/icon.png'

import { API_URL } from '../utils/exports'
import { selectUserToken } from '../store/store'
import { catchHandler } from '../utils/functions'
import { logout } from '../store/features/authSlice'

const items = [
  { label: 'Dashboard', route: '/' },
  { label: 'Users', route: '/users' },
  { label: 'Employees', route: '/employees' },
  { label: 'Access Points', route: '/access-points' },
  { label: 'Reports', route: '/reports' },
  { label: 'Logs', route: '/logs' }
]

const Navbar = ({ activeIndex = 0 }) => {
  const dispatch = useDispatch()
  const navigator = useNavigate()

  const token = useSelector(selectUserToken)

  return (
    <div>
      <div className="flex justify-content-between">
        <div className="flex">
          <Image src={IconImage} width={50} style={{ marginRight: '10px' }} />
          <TabMenu
            model={items}
            activeIndex={activeIndex}
            onTabChange={(e) => navigator(e.value.route)}
          />
        </div>
        <Button
          size="small"
          severity="warning"
          label="Logout"
          onClick={() => {
            axios
              .get(`${API_URL}/auth/logout/${token}`)
              .then()
              .catch((err) => catchHandler(err, null))
            dispatch(logout())
          }}
        />
      </div>
      <hr className="opacity-20" />
    </div>
  )
}

Navbar.propTypes = {
  activeIndex: PropTypes.number
}
export default Navbar
