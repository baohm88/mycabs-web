import { useState } from "react";
import { Card, Form, Button, Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../lib/axios";
import { toast } from "react-toastify";

export default function Login() {
    // TIP: để trống mặc định, tránh gửi nhầm
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const nav = useNavigate();
    const loc = useLocation();

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/api/auth/login", { email, password });
            console.log("RES: ", res);

            // 🔧 Backend trả về ApiEnvelope { success, data: { accessToken } }
            const token =
                res?.data?.data?.accessToken ||
                res?.data?.data?.token ||
                res?.data?.data;
            if (!token) throw new Error("No token in response");

            dispatch(setCredentials(token));
            toast.success("Logged in!");
            const to = loc.state?.from?.pathname || "/";
            nav(to, { replace: true });
        } catch (err) {
            console.error(err);
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="mx-auto" style={{ maxWidth: 420 }}>
            <Card.Body>
                <Card.Title>Login</Card.Title>
                <Form onSubmit={onSubmit}>
                    <Stack gap={3}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                // UPDATED: placeholder đổi thành email admin mới để test nhanh
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                required
                            />
                        </Form.Group>
                        <Button type="submit" disabled={loading}>
                            {loading ? "…" : "Login"}
                        </Button>
                    </Stack>
                </Form>
            </Card.Body>
        </Card>
    );
}
