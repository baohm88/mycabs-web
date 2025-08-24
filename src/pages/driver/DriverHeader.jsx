import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Button } from 'react-bootstrap'

export default function DriverHeader(){
  const { user, driver } = useSelector(s => s.auth)
  const loc = useLocation()
  const active = (p) => loc.pathname === p
  const Tab = ({ to, children }) => (
    <Button as={Link} to={to} size="sm" variant={active(to)?'primary':'outline-primary'} className="me-2">{children}</Button>
  )
  // const short = (id) => id ? `${id.slice(0,6)}…${id.slice(-4)}` : ''
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        {/* <div className="h5 mb-0">{user?.fullName || user?.email || 'Driver'} <small className="text-muted">#{short(driver?.id)}</small></div> */}
        <div className="h5 mb-0">{user?.fullName || user?.email || 'Driver'} </div>
        <div className="small text-muted">{driver?.companyName || 'Available'}</div>
      </div>
      <div className="text-nowrap">
        <Tab to="/drivers/me/openings">Openings</Tab>
        <Tab to="/drivers/me/invitations">Invitations</Tab>
        <Tab to="/drivers/me/applications">Applications</Tab>
        <Tab to="/drivers/me/wallet">Wallet</Tab>
        <Tab to="/drivers/me/transactions">Transactions</Tab>
      </div>
    </div>
  )
}