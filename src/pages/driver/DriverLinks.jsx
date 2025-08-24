// src/pages/driver/DriverLinks.jsx
import { Fragment } from "react";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DriverLinks() {
  return (
    <Fragment>
      <NavDropdown.Divider />
      {/* <NavDropdown.Header>Driver</NavDropdown.Header> */}
      <NavDropdown.Item as={Link} to="/drivers/me/openings">Openings</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/drivers/me/applications">My Applications</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/drivers/me/invitations">Invitations</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/drivers/me/wallet">My Wallet</NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/drivers/me/transactions">My Transactions</NavDropdown.Item>
    </Fragment>
  );
}
