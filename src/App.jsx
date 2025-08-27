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
import Profile from "./pages/Profile";
import UpdateAccount from "./pages/UpdateAccount";

// Riders
import RiderCompanies from "./pages/rider/RiderCompanies";
import RiderDrivers from "./pages/rider/RiderDrivers";
import Ratings from "./pages/Ratings";
import RatingCreate from "./pages/RatingCreate";

// Companies
import CompanyServices from "./pages/company/CompanyServices";
import CompanyWallet from "./pages/company/CompanyWallet";
import CompanyTransactions from "./pages/company/CompanyTransactions";
import CompanyApplications from "./pages/company/CompanyApplications";
import CompanyInvitations from "./pages/company/CompanyInvitations";
import CompanySettings from "./pages/company/CompanySettings";

// Drivers
import DriverOpenings from "./pages/driver/DriverOpenings";
import DriverInvitations from "./pages/driver/DriverInvitations";
import DriverApplications from "./pages/driver/DriverApplications";
import DriverWallet from "./pages/driver/DriverWallet";
import DriverTransactions from "./pages/driver/DriverTransactions";

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
                    <Route path="/login" element={<Login />} /> // OK
                    <Route path="/register" element={<Register />} /> // OK
                    {/* OTP */}
                    <Route path="/otp/request" element={<OtpRequest />} /> // OK
                    <Route
                        path="/otp/verify_email"
                        element={<OtpVerify />}
                    />{" "}
                    // OK
                    <Route
                        path="/otp/reset_password"
                        element={<OtpReset />}
                    />{" "}
                    // OK
                    {/* Riders (public) */}
                    <Route
                        path="/riders/companies" // OK
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
                            <Protected role="Company">
                                <CompanyServices />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/:id/wallet"
                        element={
                            <Protected role="Company">
                                <CompanyWallet />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/:id/transactions"
                        element={
                            <Protected role="Company">
                                <CompanyTransactions />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/:id/applications"
                        element={
                            <Protected role="Company">
                                <CompanyApplications />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/:id/invitations"
                        element={
                            <Protected role="Company">
                                <CompanyInvitations />
                            </Protected>
                        }
                    />
                    <Route
                        path="/companies/settings"
                        element={
                            <Protected role="Company">
                                <CompanySettings />
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
                    {/* Drivers */}
                    <Route
                        path="/drivers/me/openings"
                        element={
                            <Protected role="Driver">
                                <DriverOpenings />
                            </Protected>
                        }
                    />
                    <Route
                        path="/drivers/me/invitations"
                        element={
                            <Protected role="Driver">
                                <DriverInvitations />
                            </Protected>
                        }
                    />
                    <Route
                        path="/drivers/me/applications"
                        element={
                            <Protected role="Driver">
                                <DriverApplications />
                            </Protected>
                        }
                    />
                    <Route
                        path="/drivers/me/wallet"
                        element={
                            <Protected role="Driver">
                                <DriverWallet />
                            </Protected>
                        }
                    />
                    <Route
                        path="/drivers/me/transactions"
                        element={
                            <Protected role="Driver">
                                <DriverTransactions />
                            </Protected>
                        }
                    />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
