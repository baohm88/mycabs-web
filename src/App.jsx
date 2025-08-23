// UPDATED: thêm HomeRedirect + routes Register & OTP pages; tránh redirect loop khi chưa login
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import Protected from "./components/Protected";
// NEW: OTP pages
import OtpRequest from "./pages/OtpRequest";
import OtpVerify from "./pages/OtpVerify";
import OtpReset from "./pages/OtpReset";

// UPDATED: Quyết định trang đích dựa theo trạng thái đăng nhập
function HomeRedirect() {
    const token = useSelector((s) => s.auth.token);
    return <Navigate to={token ? "/notifications" : "/login"} replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppShell />}>
                    {/* UPDATED: dùng HomeRedirect thay vì điều hướng cứng */}
                    <Route index element={<HomeRedirect />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* NEW: OTP flows */}
                    <Route path="/otp/request" element={<OtpRequest />} />
                    <Route path="/otp/verify_email" element={<OtpVerify />} />
                    <Route path="/otp/reset_password" element={<OtpReset />} />

                    {/* Auth required */}
                    <Route
                        path="/notifications"
                        element={
                            <Protected>
                                <Notifications />
                            </Protected>
                        }
                    />

                    {/* Admin required */}
                    <Route
                        path="/admin"
                        element={
                            <Protected role="Admin">
                                <AdminDashboard />
                            </Protected>
                        }
                    />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
