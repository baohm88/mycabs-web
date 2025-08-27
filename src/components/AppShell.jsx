import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import CompanyLinks from "../pages/company/CompanyLinks";
import DriverLinks from "../pages/driver/DriverLinks";
import { setNavigator } from "../lib/nav";
import { useEffect } from "react";

export default function AppShell() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user, company, driver } = useSelector(
        (s) => s.auth
    );

    useEffect(() => {
        setNavigator(navigate);
    }, [navigate]);

    const avatarSrc =
        user?.image_url ||
        "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png";

    const onLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };
    const goProfile = () => navigate("/profile");

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
                        className="justify-content-between"
                    >
                        <Nav className="me-2">
                            <Nav.Link as={NavLink} to="/riders/companies">
                                Companies
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/riders/drivers">
                                Drivers
                            </Nav.Link>
                        </Nav>

                        {isAuthenticated ? (
                            <Nav>
                                <Nav.Link as={NavLink} to="/notifications">
                                    <i className="bi bi-bell-fill fs-5 text-muted"></i>
                                </Nav.Link>
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
                                    {/* Company menu (pass đúng company.id thay vì user.id) */}

                                    {["Company", "CompanyOwner"].includes(
                                        user?.role
                                    ) &&
                                        company?.id && (
                                            <CompanyLinks
                                                companyId={company.id}
                                            />
                                        )}
                                    {/* Driver menu */}
                                    {user?.role === "Driver" && driver && (
                                        <DriverLinks />
                                    )}
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={onLogout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        ) : (
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
