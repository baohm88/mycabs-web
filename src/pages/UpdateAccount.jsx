import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Button } from "react-bootstrap";
import { updateAccount } from "../lib/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

export default function UpdateAccount() {
    const { user, driver, company } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const role = user?.role;

    const form = useFormik({
        initialValues: {
            fullName: user?.fullName || "",
            driverPhone: driver?.phone || "",
            driverBio: driver?.bio || "",
            companyName: company?.name || "",
            companyDescription: company?.description || "",
            companyAddress: company?.address || "",
        },
        validationSchema: Yup.object({
            fullName: Yup.string().max(100),
            driverPhone: Yup.string(),
            driverBio: Yup.string(),
            companyName: Yup.string(),
            companyDescription: Yup.string(),
            companyAddress: Yup.string(),
        }),
        onSubmit: async (v, { setSubmitting }) => {
            try {
                await updateAccount({
                    fullName: v.fullName || undefined,
                    driverPhone: role === "Driver" ? v.driverPhone : undefined,
                    driverBio: role === "Driver" ? v.driverBio : undefined,
                    companyName: role === "Company" ? v.companyName : undefined,
                    companyDescription:
                        role === "Company" ? v.companyDescription : undefined,
                    companyAddress:
                        role === "Company" ? v.companyAddress : undefined,
                });
                

                toast.success("Account pdated successfully!");
                navigate("/profile");
            } catch (e) {
                if (e?.response?.status === 401) {
                    toast.error(
                        "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
                    );
                    dispatch(logout());
                    navigate("/login");
                    return;
                }
                toast.error(
                    e?.response?.data?.error?.message || "Update failed"
                );
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="container py-3">
            <Card>
                <Card.Body>
                    <Card.Title>Update account</Card.Title>
                    <form
                        onSubmit={form.handleSubmit}
                        className="row g-3"
                        noValidate
                    >
                        <div className="col-md-6">
                            <label className="form-label">Full name</label>
                            <input
                                name="fullName"
                                className="form-control"
                                value={form.values.fullName}
                                onChange={form.handleChange}
                            />
                        </div>

                        {role === "Driver" && (
                            <>
                                <div className="col-md-4">
                                    <label className="form-label">Phone</label>
                                    <input
                                        name="driverPhone"
                                        className="form-control"
                                        value={form.values.driverPhone}
                                        onChange={form.handleChange}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        name="driverBio"
                                        className="form-control"
                                        rows={3}
                                        value={form.values.driverBio}
                                        onChange={form.handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {role === "Company" && (
                            <>
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Company name
                                    </label>
                                    <input
                                        name="companyName"
                                        className="form-control"
                                        value={form.values.companyName}
                                        onChange={form.handleChange}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        name="companyDescription"
                                        className="form-control"
                                        rows={3}
                                        value={form.values.companyDescription}
                                        onChange={form.handleChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">
                                        Address
                                    </label>
                                    <input
                                        name="companyAddress"
                                        className="form-control"
                                        value={form.values.companyAddress}
                                        onChange={form.handleChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-12">
                            <Button type="submit" disabled={form.isSubmitting}>
                                {form.isSubmitting ? "…" : "Save changes"}
                            </Button>
                        </div>
                    </form>
                </Card.Body>
            </Card>
        </div>
    );
}
