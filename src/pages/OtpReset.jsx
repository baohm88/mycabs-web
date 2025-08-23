import { Card, Button } from "react-bootstrap";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../lib/axios";
import { toast } from "react-toastify";

const schema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    code: Yup.string().trim().length(6, "6 ký tự").required("Bắt buộc"),
    newPassword: Yup.string().min(6, "Tối thiểu 6 ký tự").required("Bắt buộc"),
    confirm: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Mật khẩu không khớp")
        .required("Bắt buộc"),
});

export default function OtpReset() {
    const nav = useNavigate();
    const [sp] = useSearchParams();
    const qEmail = sp.get("email") || "";

    const form = useFormik({
        initialValues: {
            email: qEmail,
            code: "",
            newPassword: "",
            confirm: "",
        },
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    email: values.email.trim(),
                    code: values.code.trim(),
                    newPassword: values.newPassword,
                };
                const res = await api.post("/api/otp/reset_password", payload);
                if (res?.data?.success) {
                    toast.success(
                        "Đặt lại mật khẩu thành công. Vui lòng đăng nhập"
                    );
                    nav("/login", { replace: true });
                } else throw new Error("Reset failed");
            } catch (err) {
                console.error(err);
                const msg =
                    err?.response?.data?.error?.message || "Reset failed";
                toast.error(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Card className="mx-auto" style={{ maxWidth: 520 }}>
            <Card.Body>
                <Card.Title>Đặt lại mật khẩu bằng OTP</Card.Title>
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
                            value={form.values.email}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            placeholder="you@example.com"
                            required
                        />
                        {form.touched.email && form.errors.email ? (
                            <div className="invalid-feedback">
                                {form.errors.email}
                            </div>
                        ) : null}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mã OTP</label>
                        <input
                            name="code"
                            className={`form-control ${
                                form.touched.code && form.errors.code
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.code}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            placeholder="123456"
                            required
                        />
                        {form.touched.code && form.errors.code ? (
                            <div className="invalid-feedback">
                                {form.errors.code}
                            </div>
                        ) : null}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu mới</label>
                        <input
                            name="newPassword"
                            type="password"
                            className={`form-control ${
                                form.touched.newPassword &&
                                form.errors.newPassword
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.newPassword}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            placeholder="••••••••"
                            required
                        />
                        {form.touched.newPassword && form.errors.newPassword ? (
                            <div className="invalid-feedback">
                                {form.errors.newPassword}
                            </div>
                        ) : null}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Xác nhận mật khẩu</label>
                        <input
                            name="confirm"
                            type="password"
                            className={`form-control ${
                                form.touched.confirm && form.errors.confirm
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.confirm}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            placeholder="••••••••"
                            required
                        />
                        {form.touched.confirm && form.errors.confirm ? (
                            <div className="invalid-feedback">
                                {form.errors.confirm}
                            </div>
                        ) : null}
                    </div>
                    <Button type="submit" disabled={form.isSubmitting}>
                        {form.isSubmitting ? "…" : "Đặt lại mật khẩu"}
                    </Button>
                    <div className="small mt-3">
                        Chưa có mã?{" "}
                        <Link
                            to={`/otp/request?mode=reset&email=${encodeURIComponent(
                                form.values.email
                            )}`}
                        >
                            Gửi mã
                        </Link>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}
