import { Card, Button } from "react-bootstrap";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../lib/axios";
import { toast } from "react-toastify";

const schema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    mode: Yup.string()
        .oneOf(["verify_email", "reset_password"])
        .default("verify_email"),
});

export default function OtpRequest() {
    const nav = useNavigate();
    const [sp] = useSearchParams();
    const qMode =
        sp.get("mode") === "reset_password" ? "reset_password" : "verify_email";
    const qEmail = sp.get("email") || "";

    const form = useFormik({
        initialValues: { email: qEmail, mode: qMode },
        validationSchema: schema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    email: values.email.trim(),
                    purpose: values.mode,
                }; // purpose: server có thể bỏ qua
                const res = await api.post("/api/otp/request", payload);

                console.log("RES:", res);

                if (res?.data?.success) {
                    toast.success(
                        "Đã gửi OTP. Xem console của API ở môi trường dev."
                    );
                    if (values.mode === "verify_email")
                        nav(
                            `/otp/verify_email?email=${encodeURIComponent(
                                values.email
                            )}`
                        );
                    else
                        nav(
                            `/otp/reset_password?email=${encodeURIComponent(
                                values.email
                            )}`
                        );
                } else throw new Error("Request OTP failed");
            } catch (err) {
                console.error(err);
                const msg =
                    err?.response?.data?.error?.message || "Request OTP failed";
                toast.error(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Card className="mx-auto" style={{ maxWidth: 480 }}>
            <Card.Body>
                <Card.Title>Yêu cầu mã OTP</Card.Title>
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
                        <label className="form-label">Mục đích</label>
                        <select
                            name="mode"
                            className={`form-select ${
                                form.touched.mode && form.errors.mode
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.mode}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                        >
                            <option value="verify_email">Xác minh email</option>
                            <option value="reset_password">
                                Đặt lại mật khẩu
                            </option>
                        </select>
                    </div>

                    <Button type="submit" disabled={form.isSubmitting}>
                        {form.isSubmitting ? "…" : "Gửi mã"}
                    </Button>
                    <div className="small mt-3">
                        Có mã rồi?{" "}
                        <Link
                            to={`/otp/verify_email?email=${encodeURIComponent(
                                form.values.email
                            )}`}
                        >
                            Xác minh
                        </Link>{" "}
                        ·{" "}
                        <Link
                            to={`/otp/reset_password?email=${encodeURIComponent(
                                form.values.email
                            )}`}
                        >
                            Đặt lại mật khẩu
                        </Link>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}
