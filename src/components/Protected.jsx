import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function Protected({ children, role }) {
    const { token, role: myRole } = useSelector((s) => s.auth);
    const loc = useLocation();
    if (!token) return <Navigate to="/login" state={{ from: loc }} replace />;
    if (role && myRole !== role) return <Navigate to="/" replace />;
    return children;
}
