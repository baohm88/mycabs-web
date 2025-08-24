import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import Protected from "./components/Protected";
// OTP
import OtpRequest from "./pages/OtpRequest";
import OtpVerify from "./pages/OtpVerify";
import OtpReset from "./pages/OtpReset";
// Riders
import RiderCompanies from "./pages/RiderCompanies";
import RiderDrivers from "./pages/RiderDrivers";
import Ratings from "./pages/Ratings";
import RatingCreate from "./pages/RatingCreate";

// OPTIONAL — if you want quick links/routes (owner view)
// Add to App.jsx
import CompanyServices from "./pages/company/CompanyServices";
import CompanyWallet from "./pages/company/CompanyWallet";
import CompanyTransactions from "./pages/company/CompanyTransactions";
import CompanyApplications from "./pages/company/CompanyApplications";
import CompanyInvitations from "./pages/company/CompanyInvitations";
import Profile from "./pages/Profile";
import UpdateAccount from "./pages/UpdateAccount";

function HomeRedirect() {
    const token = useSelector((s) => s.auth.token);
    return <Navigate to={token ? "/notifications" : "/login"} replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppShell />}>
                    <Route index element={<HomeRedirect />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    {/* OTP */}
                    <Route path="/otp/request" element={<OtpRequest />} />
                    <Route path="/otp/verify_email" element={<OtpVerify />} />
                    <Route path="/otp/reset_password" element={<OtpReset />} />
                    {/* Riders (public) */}
                    <Route
                        path="/riders/companies"
                        element={<RiderCompanies />}
                    />
                    <Route path="/riders/drivers" element={<RiderDrivers />} />
                    <Route path="/riders/ratings" element={<Ratings />} />
                    {/* Create rating requires login */}
                    <Route
                        path="/riders/rate"
                        element={
                            <Protected>
                                <RatingCreate />
                            </Protected>
                        }
                    />
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
                    {/* Company */}
                    <Route
                        path="/companies/:id/services"
                        element={
                            <Protected>
                                <CompanyServices />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/:id/wallet"
                        element={
                            <Protected>
                                <CompanyWallet />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/:id/transactions"
                        element={
                            <Protected>
                                <CompanyTransactions />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/:id/applications"
                        element={
                            <Protected>
                                <CompanyApplications />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/:id/invitations"
                        element={
                            <Protected>
                                <CompanyInvitations />
                            </Protected>
                        }
                    />
                    //{" "}
                    <Route
                        path="/profile"
                        element={
                            <Protected>
                                <Profile />
                            </Protected>
                        }
                    />
                    //{" "}
                    <Route
                        path="/update-account"
                        element={
                            <Protected>
                                <UpdateAccount />
                            </Protected>
                        }
                    />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
