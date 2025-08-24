import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCompany, addCompanyService } from "../../lib/companies";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CompanyHeader from "./CompanyHeader";

const schema = Yup.object({
    type: Yup.string()
        .oneOf(["taxi", "xe_om", "hang_hoa", "tour"])
        .required("Required"),
    title: Yup.string().max(100).required("Required"),
    basePrice: Yup.number().min(0).required("Required"),
});

export default function CompanyServices() {
    const { id } = useParams();
    const qc = useQueryClient();
    const { data } = useQuery({
        queryKey: ["company", id],
        queryFn: () => getCompany(id),
    });
    const services = data?.services || data?.Services || [];

    const form = useFormik({
        initialValues: { type: "taxi", title: "", basePrice: 0 },
        validationSchema: schema,
        onSubmit: async (v, { setSubmitting, resetForm }) => {
            try {
                await addCompanyService(id, v);
                toast.success("Service added");
                await qc.invalidateQueries({ queryKey: ["company", id] });
                resetForm();
            } catch (e) {
                toast.error(e?.response?.data?.error?.message || "Add failed");
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
            <CompanyHeader />
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Add service</Card.Title>
                    <form
                        onSubmit={form.handleSubmit}
                        noValidate
                        className="row g-2 align-items-end"
                    >
                        <div className="col-sm-3">
                            <label className="form-label">Type</label>
                            <select
                                name="type"
                                className={`form-select ${
                                    form.touched.type && form.errors.type
                                        ? "is-invalid"
                                        : ""
                                }`}
                                value={form.values.type}
                                onChange={form.handleChange}
                            >
                                <option value="taxi">taxi</option>
                                <option value="xe_om">xe_om</option>
                                <option value="hang_hoa">hang_hoa</option>
                                <option value="tour">tour</option>
                            </select>
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label">Title</label>
                            <input
                                name="title"
                                className={`form-control ${
                                    form.touched.title && form.errors.title
                                        ? "is-invalid"
                                        : ""
                                }`}
                                value={form.values.title}
                                onChange={form.handleChange}
                            />
                        </div>
                        <div className="col-sm-3">
                            <label className="form-label">Base price</label>
                            <input
                                name="basePrice"
                                type="number"
                                min={0}
                                className={`form-control ${
                                    form.touched.basePrice &&
                                    form.errors.basePrice
                                        ? "is-invalid"
                                        : ""
                                }`}
                                value={form.values.basePrice}
                                onChange={form.handleChange}
                            />
                        </div>
                        <div className="col-sm-2">
                            <Button type="submit" disabled={form.isSubmitting}>
                                {form.isSubmitting ? "…" : "Add"}
                            </Button>
                        </div>
                    </form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>Services</Card.Header>
                <table className="table table-sm mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Title</th>
                            <th className="text-end">Base Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s, i) => (
                            <tr key={s.serviceId || s.ServiceId || i}>
                                <td>{i + 1}</td>
                                <td>{s.type || s.Type}</td>
                                <td>{s.title || s.Title}</td>
                                <td className="text-end">
                                    {(
                                        s.basePrice ??
                                        s.BasePrice ??
                                        0
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </>
    );
}
