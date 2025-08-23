import { Card, Button } from "react-bootstrap";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../lib/axios";
import { toast } from "react-toastify";

const schema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    code: Yup.string().trim().length(6, "6 ký tự").required("Bắt buộc"),
});

export default function OtpVerify() {
    const nav = useNavigate();
    const [sp] = useSearchParams();
    const qEmail = sp.get("email") || "";

    const form = useFormik({
        initialValues: { email: qEmail, code: "" },
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    email: values.email.trim(),
                    code: values.code.trim(),
                    purpose: 'verify_email'
                };
                const res = await api.post("/api/otp/verify_email", payload);
                if (res?.data?.success) {
                    toast.success(
                        "Xác minh email thành công. Đăng nhập lại nhé!"
                    );
                    nav("/login", { replace: true });
                } else throw new Error("Verify failed");
            } catch (err) {
                console.error(err);
                const msg =
                    err?.response?.data?.error?.message || "Verify failed";
                toast.error(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Card className="mx-auto" style={{ maxWidth: 480 }}>
            <Card.Body>
                <Card.Title>Xác minh email bằng OTP</Card.Title>
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
                    <Button type="submit" disabled={form.isSubmitting}>
                        {form.isSubmitting ? "…" : "Xác minh"}
                    </Button>
                    <div className="small mt-3">
                        Chưa có mã?{" "}
                        <Link
                            to={`/otp/request?mode=verify&email=${encodeURIComponent(
                                form.values.email
                            )}`}
                        >
                            Gửi lại mã
                        </Link>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}
