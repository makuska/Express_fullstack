import {Link, NavigateFunction, useNavigate} from 'react-router-dom'
import {useAuth} from "../../hooks/useAuth.ts";

function DashHeader() {
  const navigate: NavigateFunction = useNavigate();
  const {logout, user} = useAuth()

  async function handleLogoutButtonCLick() {
      await logout()
      navigate('/')
  }

  return(
    <div className='header'>
      <Link to="/" className="logo">CompanyLogo</Link>
      <div className="header-right">
        <Link to="/profile">Profile</Link>
        <Link className="active" onClick={handleLogoutButtonCLick} to="/login">Logout</Link>
      </div>
      <div className="header">
        Hello {user.username}
      </div>
    </div>
  )
}

export default DashHeader