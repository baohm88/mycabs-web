import { Container, Navbar, Nav, Badge, Button } from "react-bootstrap";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { setUnread } from "../store/uiSlice";
import {
    startNotificationsHub,
    startAdminHub,
    stopAllHubs,
} from "../lib/singalr.js";
import api from "../lib/axios";
import { useEffect } from "react";

export default function AppShell() {
    const { token, role } = useSelector((s) => s.auth);
    const unread = useSelector((s) => s.ui.unreadCount);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const loc = useLocation();

    // Start hubs after login
    useEffect(() => {
        let mounted = true;
        async function boot() {
            if (!token) return;
            // initial unread sync
            try {
                const res = await api.get("/api/notifications/unread-count");
                const count = res?.data?.data?.count ?? 0;
                if (mounted) dispatch(setUnread(count));
            } catch {}

            await startNotificationsHub({
                onUnread: ({ count }) => dispatch(setUnread(count ?? 0)),
                onNotification: (p) => console.log("notification", p),
                onChat: (m) => console.log("chat.message", m),
            });

            if (role === "Admin") {
                await startAdminHub({
                    onTxNew: (tx) => console.log("admin:tx:new", tx),
                });
            }
        }
        boot();
        return () => {
            mounted = false;
        };
    }, [token, role, dispatch]);

    function doLogout() {
        stopAllHubs();
        dispatch(logout());
        nav("/login");
    }

    return (
        <>
            <Navbar bg="light" expand="sm" className="mb-3">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <b>My</b>Cabs
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {token && (
                                <Nav.Link
                                    as={Link}
                                    to="/notifications"
                                    active={loc.pathname === "/notifications"}
                                >
                                    Notifications{" "}
                                    {unread > 0 && (
                                        <Badge
                                            bg="primary"
                                            pill
                                            className="ms-1"
                                        >
                                            {unread}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            )}
                            {token && role === "Admin" && (
                                <Nav.Link
                                    as={Link}
                                    to="/admin"
                                    active={loc.pathname === "/admin"}
                                >
                                    Admin
                                </Nav.Link>
                            )}
                        </Nav>
                        <div className="d-flex gap-2">
                            {!token ? (
                                <Button
                                    size="sm"
                                    variant="outline-primary"
                                    as={Link}
                                    to="/login"
                                >
                                    Login
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={doLogout}
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="pb-4">
                <Outlet />
            </Container>
        </>
    );
}
