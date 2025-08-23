import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Button, Badge, Alert } from "react-bootstrap";
import { createRating } from "../lib/riders";
import { toast } from "react-toastify";

const schema = Yup.object({
    targetType: Yup.string().oneOf(["company", "driver"]).required("Bắt buộc"),
    targetId: Yup.string().required("Bắt buộc"),
    stars: Yup.number().min(1).max(5).required("Bắt buộc"),
    comment: Yup.string().max(500),
});

function StarPicker({ value, onChange }) {
    const v = Number(value) || 0;
    return (
        <div role="radiogroup" aria-label="Chọn số sao" className="fs-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    className="btn btn-link p-0 me-1 text-decoration-none"
                    aria-pressed={i <= v}
                    onClick={() => onChange(i)}
                    title={`${i} sao`}
                    style={{ lineHeight: 1 }}
                >
                    {i <= v ? "★" : "☆"}
                </button>
            ))}
        </div>
    );
}

export default function RatingCreate() {
    const [sp] = useSearchParams();
    const nav = useNavigate();

    const init = {
        targetType: (sp.get("targetType") || "company").toLowerCase(),
        targetId: sp.get("targetId") || "",
        stars: 5,
        comment: "",
    };
    const name = sp.get("name") || "";
    const typeLabel =
        init.targetType === "driver"
            ? "Tài xế"
            : init.targetType === "company"
            ? "Công ty"
            : init.targetType;

    const form = useFormik({
        initialValues: init,
        validationSchema: schema,
        onSubmit: async (v, { setSubmitting }) => {
            try {
                const res = await createRating(v);
                toast.success(res.message);
                nav(
                    `/riders/ratings?targetType=${v.targetType}&targetId=${v.targetId}`
                );
            } catch (e) {
                toast.error("Tạo đánh giá thất bại");
            } finally {
                setSubmitting(false);
            }
        },
    });

    const missing = !form.values.targetId || !form.values.targetType;

    return (
        <Card className="mx-auto" style={{ maxWidth: 520 }}>
            <Card.Body>
                <Card.Title>
                    Đánh giá{" "}
                    <Badge bg="secondary" className="align-middle">
                        {typeLabel}
                    </Badge>{" "}
                    {name ? (
                        <span className="align-middle">– {name}</span>
                    ) : null}
                </Card.Title>

                {missing && (
                    <Alert variant="warning" className="mb-3">
                        Thiếu tham số. Hãy trở lại trang danh sách và bấm{" "}
                        <b>Đánh giá</b> tại mục mong muốn.{" "}
                        <Link to="/riders/companies">Về danh sách công ty</Link>
                    </Alert>
                )}

                <form onSubmit={form.handleSubmit} noValidate>
                    {/* HIDDEN: targetType & targetId vẫn ở trong form values để gửi lên BE */}
                    <input
                        type="hidden"
                        name="targetType"
                        value={form.values.targetType}
                    />
                    <input
                        type="hidden"
                        name="targetId"
                        value={form.values.targetId}
                    />

                    <div className="mb-3">
                        <label className="form-label">Số sao</label>
                        <StarPicker
                            value={form.values.stars}
                            onChange={(n) => form.setFieldValue("stars", n)}
                        />
                        {form.touched.stars && form.errors.stars ? (
                            <div className="invalid-feedback d-block">
                                {form.errors.stars}
                            </div>
                        ) : null}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Nhận xét (tuỳ chọn)
                        </label>
                        <textarea
                            name="comment"
                            className={`form-control ${
                                form.touched.comment && form.errors.comment
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.comment}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            rows={3}
                            placeholder="Chia sẻ trải nghiệm của bạn…"
                        />
                        {form.touched.comment && form.errors.comment ? (
                            <div className="invalid-feedback">
                                {form.errors.comment}
                            </div>
                        ) : null}
                    </div>

                    <Button
                        type="submit"
                        disabled={form.isSubmitting || missing}
                    >
                        {form.isSubmitting ? "…" : "Gửi đánh giá"}
                    </Button>
                </form>
            </Card.Body>
        </Card>
    );
}
