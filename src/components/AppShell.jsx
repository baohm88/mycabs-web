import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import CompanyLinks from "../pages/company/CompanyLinks";

export default function AppShell() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user, company } = useSelector((s) => s.auth);

    const avatarSrc =
        user?.image_url ||
        "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png";

    const onLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const goProfile = () => navigate("/profile");

    const companyId = company?.id || company?.Id;

    return (
        <>
            <Navbar bg="light" expand="md" className="shadow-sm">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        MyCabs
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-nav" />
                    <Navbar.Collapse
                        id="main-nav"
                        className="justify-content-end"
                    >
                        <Nav className="me-2">
                            <Nav.Link as={NavLink} to="/">
                                Home
                            </Nav.Link>
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
                                            style={{
                                                width: 30,
                                                height: 30,
                                                objectFit: "cover",
                                            }}
                                        />
                                    }
                                >
                                    <NavDropdown.Item
                                        disabled
                                        className="small text-muted"
                                    >
                                        {user?.email || "Account"}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={goProfile}>
                                        Profile
                                    </NavDropdown.Item>
                                    {user.role === "Company" && companyId && (
                                        <CompanyLinks companyId={companyId} />
                                    )}
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={onLogout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        ) : (
                            // Login button when logged out
                            <Nav>
                                <Nav.Link as={NavLink} to="/login">
                                    Login
                                </Nav.Link>
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
