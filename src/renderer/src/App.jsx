import { useSelector } from 'react-redux'
import { HashRouter, Route, Routes } from 'react-router-dom'

//Screens
import Help from './screens/Help'
import Login from './screens/Login'
import Logs from './screens/protected/Logs'
import Users from './screens/protected/Users'
import Reports from './screens/protected/Reports'
import Dashbord from './screens/protected/Dashbord'
import Settings from './screens/protected/Settings'
import Employee from './screens/protected/Employee'
import ForgotPassword from './screens/ForgotPassword'
import AccessPoints from './screens/protected/AccessPoints'
import SocketDashboardWrapper from './components/SocketDashboardWrapper'

export default function App() {
  const isLogged = useSelector((state) => state.auth.state)
  const user = useSelector((state) => state.auth.user)

  return (
    <SocketDashboardWrapper>
      <HashRouter>
        {isLogged && user ? (
          //true ? (
          <Routes>
            <Route path="/" index element={<Dashbord />} />
            <Route path="/help" element={<Help />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/access-points" element={<AccessPoints />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" index element={<Dashbord />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/help" element={<Help />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Help />} />
          </Routes>
        )}
      </HashRouter>
    </SocketDashboardWrapper>
  )
}
