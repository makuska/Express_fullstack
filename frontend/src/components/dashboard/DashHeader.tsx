import { Link } from 'react-router-dom'

function DashHeader() {

  return(
    <div className='header'>
      <Link to="/" className="logo">CompanyLogo</Link>
      <div className="header-right">
        <Link to="/profile">Profile</Link>
        <Link className="active" to="/login">Logout</Link>
      </div>
    </div>
  )
}

export default DashHeader