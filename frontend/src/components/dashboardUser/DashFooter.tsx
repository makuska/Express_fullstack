import {Link} from 'react-router-dom'

function DashFooter() {

  return(
    <div className='header'>
      <Link to="/" className="logo">CompanyLogo</Link>
      <div className="header-right">
      </div>
    </div>
  )
}

export default DashFooter