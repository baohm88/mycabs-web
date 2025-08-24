// import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
// import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../store/authSlice";

// export default function AppShell() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const user = useSelector((s) => s.auth.user); // UPDATED: read profile.user from store

//   // UPDATED: avatar source with fallback
//   const avatarSrc = user?.image_url ||
//     "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png";

//   const onLogout = () => {
//     dispatch(logout()); // UPDATED: clear auth state
//     navigate("/login");
//   };

//   return (
//     <>
//       <Navbar bg="light" expand="md" className="shadow-sm">
//         <Container>
//           <Navbar.Brand as={Link} to="/">MyCabs</Navbar.Brand>
//           <Navbar.Toggle aria-controls="main-nav" />
//           <Navbar.Collapse id="main-nav" className="justify-content-end">
//             <Nav className="me-2">
//               {/* keep your existing nav links here */}
//               <Nav.Link as={NavLink} to="/">Home</Nav.Link>
//               <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
//             </Nav>

//             {/* NEW: Avatar dropdown on the right */}
//             <Nav>
//               <NavDropdown
//                 align="end"
//                 id="nav-avatar-dropdown"
//                 title={
//                   <Image
//                     src={avatarSrc}
//                     roundedCircle
//                     alt="avatar"
//                     style={{ width: 30, height: 30, objectFit: "cover" }}
//                   />
//                 }
//               >
//                 {/* NEW: show email as first item (disabled) */}
//                 <NavDropdown.Item disabled className="small text-muted">
//                   {user?.email || "Account"}
//                 </NavDropdown.Item>
//                 <NavDropdown.Divider />
//                 {/* NEW: logout */}
//                 <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
//               </NavDropdown>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <main className="py-3">
//         <Container>
//           <Outlet />
//         </Container>
//       </main>
//     </>
//   );
// }

// src/layout/AppShell.jsx
// UPDATED: conditionally render avatar dropdown (when logged in) or Login button
// CHANGED: moved Profile into the avatar dropdown

import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

export default function AppShell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const avatarSrc =
    user?.image_url ||
    "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png";

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const goProfile = () => navigate("/profile"); // NEW

  return (
    <>
      <Navbar bg="light" expand="md" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">MyCabs</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav" className="justify-content-end">
            <Nav className="me-2">
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              {/* CHANGED: removed top-level Profile link */}
            </Nav>

            {isAuthenticated ? (
              // Avatar Dropdown when logged in
              <Nav>
                <NavDropdown
                  align="end"
                  id="nav-avatar-dropdown"
                  title={
                    <Image
                      src={avatarSrc}
                      roundedCircle
                      alt="avatar"
                      style={{ width: 30, height: 30, objectFit: "cover" }}
                    />
                  }
                >
                  <NavDropdown.Item disabled className="small text-muted">
                    {user?.email || "Account"}
                  </NavDropdown.Item>
                  {/* NEW: Profile in dropdown */}
                  <NavDropdown.Item onClick={goProfile}>Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              // Login button when logged out
              <Nav>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
}