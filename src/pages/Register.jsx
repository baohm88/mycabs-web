// UPDATED: thêm field role + Formik + Yup validation
import { Card, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const ROLES = ["Rider", "Company", "Driver", "Admin"]; // Admin chỉ để test

const schema = Yup.object({
    fullName: Yup.string().trim().required("Bắt buộc"),
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    password: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
    role: Yup.string().oneOf(ROLES).required("Bắt buộc"),
});

export default function Register() {
    const nav = useNavigate();

    const form = useFormik({
        initialValues: { fullName: "", email: "", password: "", role: "Rider" },
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    email: values.email.trim(),
                    password: values.password,
                    fullName: values.fullName.trim(),
                    role: values.role,
                };
                const res = await api.post("/api/auth/register", payload);

                if (res?.data?.success) {
                    toast.success("Registered successfully! Please verify your email");
                    nav("/otp/request?mode=verify", { replace: true });
                } else {
                    throw new Error("Register failed");
                }
            } catch (err) {
                console.error(err);
                const msg =
                    err?.response?.data?.error?.message || "Register failed";
                toast.error(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Card className="mx-auto" style={{ maxWidth: 480 }}>
            <Card.Body>
                <Card.Title>Register</Card.Title>
                <form onSubmit={form.handleSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label">Full name</label>
                        <input
                            name="fullName"
                            className={`form-control ${
                                form.touched.fullName && form.errors.fullName
                                    ? "is-invalid"
                                    : ""
                            }`}
                            placeholder="Nguyễn Văn A"
                            value={form.values.fullName}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            required
                        />
                        {form.touched.fullName && form.errors.fullName ? (
                            <div className="invalid-feedback">
                                {form.errors.fullName}
                            </div>
                        ) : null}
                    </div>

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

                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            name="role"
                            className={`form-select ${
                                form.touched.role && form.errors.role
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.role}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            required
                        >
                            {ROLES.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                        {form.touched.role && form.errors.role ? (
                            <div className="invalid-feedback">
                                {form.errors.role}
                            </div>
                        ) : (
                            <div className="form-text">
                                Chọn "Admin" chỉ để test.
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={form.isSubmitting}>
                        {form.isSubmitting ? "…" : "Create account"}
                    </Button>
                    <div className="text-center small mt-3">
                        Already had an account?{" "}
                        <Link to="/login">Login here</Link>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}
