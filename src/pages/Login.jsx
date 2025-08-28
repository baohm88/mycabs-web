import { Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice"; // CHANGED: dùng setAuth thay vì setCredentials
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../lib/auth";

const schema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
});

export default function Login() {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const loc = useLocation();

    const form = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // gọi BE: trả { accessToken, profile }
                const data = await login(values);
                if (!data?.accessToken) throw new Error("No token in response");
                dispatch(setAuth(data));
                toast.success("Logged in!");
                // const to = loc.state?.from?.pathname || "/";
                // nav(to, { replace: true });
                const from = loc.state?.from?.pathname;
                const isBlocked =
                    from &&
                    (from.startsWith("/companies/") ||
                        from.startsWith("/admin"));
                // luôn đưa về notifications nếu "from" là trang không phù hợp
                nav(isBlocked ? "/notifications" : from || "/notifications", {
                    replace: true,
                });
            } catch (err) {
                const code = err?.response?.data?.error?.code;
                const msg =
                    err?.response?.data?.error?.message || "Login failed";

                if (code === "EMAIL_NOT_VERIFIED") {
                    toast.warn("Email chưa xác minh. Vui lòng nhập OTP.");
                    const email = form.values.email.trim();
                    nav(
                        `/otp/request?mode=verify&email=${encodeURIComponent(
                            email
                        )}`
                    );
                    return;
                }
                toast.error(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Card className="mx-auto" style={{ maxWidth: 420 }}>
            <Card.Body>
                <Card.Title>Login</Card.Title>
                <form onSubmit={form.handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            name="email"
                            type="email"
                            className={`form-control ${
                                form.touched.email && form.errors.email
                                    ? "is-invalid"
                                    : ""
                            }`}
                            placeholder="you@mycabs.com"
                            value={form.values.email}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            required
                        />
                        {form.touched.email && form.errors.email ? (
                            <div className="invalid-feedback">
                                {form.errors.email}
                            </div>
                        ) : null}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            name="password"
                            type="password"
                            className={`form-control ${
                                form.touched.password && form.errors.password
                                    ? "is-invalid"
                                    : ""
                            }`}
                            placeholder="••••••••"
                            value={form.values.password}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            required
                        />
                        {form.touched.password && form.errors.password ? (
                            <div className="invalid-feedback">
                                {form.errors.password}
                            </div>
                        ) : null}
                    </div>

                    <Button type="submit" disabled={form.isSubmitting}>
                        {form.isSubmitting ? "…" : "Login"}
                    </Button>

                    <div className="d-flex justify-content-between small mt-3">
                        <span>
                            Chưa có tài khoản?{" "}
                            <Link to="/register">Đăng ký</Link>
                        </span>
                        <span className="text-nowrap">
                            <Link to="/otp/request?mode=reset_password">
                                Quên mật khẩu?
                            </Link>{" "}
                            ·{" "}
                            <Link to="/otp/request?mode=verify_email">
                                Xác minh email
                            </Link>
                        </span>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}
