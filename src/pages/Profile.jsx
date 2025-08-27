import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../lib/auth";
import { setAuth, logout } from "../store/authSlice";
import {
    Row,
    Col,
    Card,
    Badge,
    Button,
    Image,
    ListGroup,
    Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user, driver, company } = useSelector((s) => s.auth);
    const [loading, setLoading] = useState(false);

    const avatar =
        user?.image_url ||
        "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png";

    useEffect(() => {
        (async () => {
            if (!token) return;
            try {
                setLoading(true);
                const data = await getMe();

                console.log("PROFILE: ", data);

                if (data) dispatch(setAuth({ token, profile: data }));
            } catch (err) {
                if (err?.response?.status === 401) {
                    toast.error(
                        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại"
                    );
                    dispatch(logout());
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [token, dispatch]);

    const role = user?.role || "Rider";
    const shortId = (id) => (id ? `${id.slice(0, 6)}…${id.slice(-4)}` : "");

    return (
        <div className="py-3">
            <Card className="mb-3">
                <Card.Body className="d-flex align-items-center gap-3 flex-wrap">
                    <Image
                        src={avatar}
                        roundedCircle
                        style={{ width: 72, height: 72, objectFit: "cover" }}
                        alt="avatar"
                    />
                    <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                            <h5 className="mb-0">
                                {user?.fullName || user?.email || "Account"}
                            </h5>
                            <Badge bg="secondary">{role}</Badge>
                            {user?.emailVerified ? (
                                <Badge bg="success">Email verified</Badge>
                            ) : (
                                <Badge bg="warning" text="dark">
                                    Email not verified
                                </Badge>
                            )}
                        </div>
                        <div className="text-muted small">{user?.email}</div>
                    </div>
                    <div className="ms-auto d-flex gap-2">
                        <Button
                            as={Link}
                            to="/update-account"
                            variant="primary"
                            size="sm"
                        >
                            Edit profile
                        </Button>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                                setLoading(true);
                                getMe()
                                    .then(
                                        (d) =>
                                            d &&
                                            dispatch(
                                                setAuth({ token, profile: d })
                                            )
                                    )
                                    .finally(() => setLoading(false));
                            }}
                        >
                            {loading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                "Refresh"
                            )}
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Card>
                        <Card.Header>Account details</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <span className="text-muted me-2">
                                    User ID:
                                </span>
                                {shortId(user?.id)}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span className="text-muted me-2">Email:</span>
                                {user?.email}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span className="text-muted me-2">
                                    Full name:
                                </span>
                                {user?.fullName || "—"}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span className="text-muted me-2">Role:</span>
                                {role}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                {role === "Driver" && (
                    <Col xs={12} md={6}>
                        <Card>
                            <Card.Header>Driver</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Driver ID:
                                    </span>
                                    {shortId(driver?.id)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Company ID:
                                    </span>
                                    {shortId(driver?.companyId) || "—"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Status:
                                    </span>
                                    <Badge
                                        bg={
                                            driver?.status === "available"
                                                ? "success"
                                                : "secondary"
                                        }
                                    >
                                        {driver?.status || "—"}
                                    </Badge>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Phone:
                                    </span>
                                    {driver?.phone || "—"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Bio:
                                    </span>
                                    {driver?.bio || "—"}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                )}

                {role === "Company" && (
                    <Col xs={12} md={6}>
                        <Card>
                            <Card.Header>Company</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Company ID:
                                    </span>
                                    {shortId(company?.id)}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Name:
                                    </span>
                                    {company?.name || "—"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Description:
                                    </span>
                                    {company?.description || "—"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <span className="text-muted me-2">
                                        Address:
                                    </span>
                                    {company?.address || "—"}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
}
