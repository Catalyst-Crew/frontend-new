import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Image } from 'primereact/image'
import { Button } from 'primereact/button'
import { TabMenu } from 'primereact/tabmenu'

import IconImage from '../assets/images/icon.png'

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
  const navigator = useNavigate()
  const dispatch = useDispatch()

  return (
    <div>
      <div className="flex justify-content-between">
        <div className="flex">
          <Image src={IconImage} width={40} />
          <TabMenu
            model={items}
            activeIndex={activeIndex}
            onTabChange={(e) => navigator(e.value.route)}
          />
        </div>
        <Button
          className="logbutton"
          size="small"
          severity="warning"
          label="Logout"
          type="button"
          onClick={() => {
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
