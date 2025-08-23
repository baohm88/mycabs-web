// // UPDATED: dùng Formik + Yup để validate, giữ placeholder admin@mycabs.com
// import { Card, Button } from "react-bootstrap";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "../store/authSlice";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import api from "../lib/axios";
// import { toast } from "react-toastify";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// const schema = Yup.object({
//     email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
//     password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
// });

// export default function Login() {
//     const dispatch = useDispatch();
//     const nav = useNavigate();
//     const loc = useLocation();

//     const form = useFormik({
//         initialValues: { email: "", password: "" },
//         validationSchema: schema,
//         onSubmit: async (values, { setSubmitting }) => {
//             try {
//                 const res = await api.post("/api/auth/login", values);
//                 const token =
//                     res?.data?.data?.accessToken ||
//                     res?.data?.data?.token ||
//                     res?.data?.data;
//                 if (!token) throw new Error("No token in response");
//                 dispatch(setCredentials(token));
//                 toast.success("You're logged in! Welcome back!");
//                 const to = loc.state?.from?.pathname || "/";
//                 nav(to, { replace: true });
//             } catch (err) {
//                 console.error(err);
//                 toast.error("Login failed");
//             } finally {
//                 setSubmitting(false);
//             }
//         },
//     });

//     return (
//         <Card className="mx-auto" style={{ maxWidth: 420 }}>
//             <Card.Body>
//                 <Card.Title>Login</Card.Title>
//                 <form onSubmit={form.handleSubmit} noValidate>
//                     <div className="mb-3">
//                         <label className="form-label">Email</label>
//                         <input
//                             name="email"
//                             type="email"
//                             className={`form-control ${
//                                 form.touched.email && form.errors.email
//                                     ? "is-invalid"
//                                     : ""
//                             }`}
//                             placeholder="you@mycabs.com" // UPDATED: placeholder email admin
//                             value={form.values.email}
//                             onChange={form.handleChange}
//                             onBlur={form.handleBlur}
//                             required
//                         />
//                         {form.touched.email && form.errors.email ? (
//                             <div className="invalid-feedback">
//                                 {form.errors.email}
//                             </div>
//                         ) : null}
//                     </div>

//                     <div className="mb-3">
//                         <label className="form-label">Password</label>
//                         <input
//                             name="password"
//                             type="password"
//                             className={`form-control ${
//                                 form.touched.password && form.errors.password
//                                     ? "is-invalid"
//                                     : ""
//                             }`}
//                             placeholder="••••••••"
//                             value={form.values.password}
//                             onChange={form.handleChange}
//                             onBlur={form.handleBlur}
//                             required
//                         />
//                         {form.touched.password && form.errors.password ? (
//                             <div className="invalid-feedback">
//                                 {form.errors.password}
//                             </div>
//                         ) : null}
//                     </div>

//                     <Button type="submit" disabled={form.isSubmitting}>
//                         {form.isSubmitting ? "…" : "Login"}
//                     </Button>
//                     <div className="text-center small mt-3">
//                         No account yet?{" "}
//                         <Link to="/register">Register here</Link>
//                     </div>
//                 </form>
//             </Card.Body>
//         </Card>
//     );
// }

// UPDATED: dùng Formik + Yup để validate, giữ placeholder admin@mycabs.com
// UPDATED: thêm liên kết Forgot password? (OTP reset) + Verify email (OTP verify)
import { Card, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../lib/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

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
                const res = await api.post("/api/auth/login", values);
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
                const msg =
                    err?.response?.data?.error?.message || "Login failed";
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
                            placeholder="you@mycabs.com" // UPDATED: placeholder email admin
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
                            <Link to="/otp/request?mode=reset">
                                Quên mật khẩu?
                            </Link>{" "}
                            ·{" "}
                            <Link to="/otp/request?mode=verify">
                                Xác minh email
                            </Link>
                        </span>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}
