import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getCompanyWallet,
    topupCompanyWallet,
    payCompanySalary,
    payCompanyMembership,
} from "../../lib/companies";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CompanyHeader from "./CompanyHeader";

export default function CompanyWallet() {
    const { id } = useParams();
    const qc = useQueryClient();
    const { data } = useQuery({
        queryKey: ["companyWallet", id],
        queryFn: () => getCompanyWallet(id),
    });
    const w = data || {};

    return (
        <>
            <CompanyHeader />
            <Card className="mb-3">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="text-muted">Wallet ID</div>
                            <div className="fw-bold">{w.id || w.Id}</div>
                        </div>
                        <div className="text-end">
                            <div className="text-muted">Balance</div>
                            <div className="display-6">
                                {(w.balance ?? w.Balance ?? 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <TopUp
                id={id}
                onDone={() =>
                    qc.invalidateQueries({ queryKey: ["companyWallet", id] })
                }
            />
            <PaySalary
                id={id}
                onDone={() =>
                    qc.invalidateQueries({ queryKey: ["companyWallet", id] })
                }
            />
            <PayMembership
                id={id}
                onDone={() =>
                    qc.invalidateQueries({ queryKey: ["companyWallet", id] })
                }
            />
        </>
    );
}

function TopUp({ id, onDone }) {
    const form = useFormik({
        initialValues: { amount: 0, note: "" },
        validationSchema: Yup.object({
            amount: Yup.number().positive().required("Required"),
        }),
        onSubmit: async (v, { setSubmitting, resetForm }) => {
            try {
                await topupCompanyWallet(id, v);
                toast.success("Wallet topped up");
                onDone?.();
                resetForm();
            } catch (e) {
                toast.error(
                    e?.response?.data?.error?.message || "Top up failed"
                );
            } finally {
                setSubmitting(false);
            }
        },
    });
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Top up wallet</Card.Title>
                <form
                    onSubmit={form.handleSubmit}
                    className="row g-2"
                    noValidate
                >
                    <div className="col-sm-3">
                        <label className="form-label">Amount</label>
                        <input
                            name="amount"
                            type="number"
                            min={1}
                            className={`form-control ${
                                form.touched.amount && form.errors.amount
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.amount}
                            onChange={form.handleChange}
                        />
                    </div>
                    <div className="col-sm-7">
                        <label className="form-label">Note</label>
                        <input
                            name="note"
                            className="form-control"
                            value={form.values.note}
                            onChange={form.handleChange}
                        />
                    </div>
                    <div className="col-sm-2 align-self-end">
                        <Button type="submit" disabled={form.isSubmitting}>
                            {form.isSubmitting ? "…" : "Top up"}
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}

function PaySalary({ id, onDone }) {
    const form = useFormik({
        initialValues: { driverId: "", amount: 0, note: "" },
        validationSchema: Yup.object({
            driverId: Yup.string().required("Required"),
            amount: Yup.number().positive().required("Required"),
        }),
        onSubmit: async (v, { setSubmitting, resetForm }) => {
            try {
                await payCompanySalary(id, v);
                toast.success("Salary paid");
                onDone?.();
                resetForm();
            } catch (e) {
                toast.error(
                    e?.response?.data?.error?.message || "Pay salary failed"
                );
            } finally {
                setSubmitting(false);
            }
        },
    });
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Pay salary to driver</Card.Title>
                <form
                    onSubmit={form.handleSubmit}
                    className="row g-2"
                    noValidate
                >
                    <div className="col-sm-4">
                        <label className="form-label">Driver UserId</label>
                        <input
                            name="driverId"
                            className={`form-control ${
                                form.touched.driverId && form.errors.driverId
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.driverId}
                            onChange={form.handleChange}
                        />
                    </div>
                    <div className="col-sm-3">
                        <label className="form-label">Amount</label>
                        <input
                            name="amount"
                            type="number"
                            min={1}
                            className={`form-control ${
                                form.touched.amount && form.errors.amount
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.amount}
                            onChange={form.handleChange}
                        />
                    </div>
                    <div className="col-sm-4">
                        <label className="form-label">Note</label>
                        <input
                            name="note"
                            className="form-control"
                            value={form.values.note}
                            onChange={form.handleChange}
                        />
                    </div>
                    <div className="col-sm-1 align-self-end">
                        <Button type="submit" disabled={form.isSubmitting}>
                            {form.isSubmitting ? "…" : "Pay"}
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}

function PayMembership({ id, onDone }) {
    const form = useFormik({
        initialValues: {
            plan: "Basic",
            billingCycle: "monthly",
            amount: 0,
            note: "",
        },
        validationSchema: Yup.object({
            plan: Yup.string()
                .oneOf(["Free", "Basic", "Premium", "basic", "premium", "Free"])
                .required(),
            billingCycle: Yup.string()
                .oneOf(["monthly", "quarterly"])
                .required(),
            amount: Yup.number().min(0).required("Required"),
        }),
        onSubmit: async (v, { setSubmitting, resetForm }) => {
            try {
                await payCompanyMembership(id, v);
                toast.success("Membership paid");
                onDone?.();
                resetForm();
            } catch (e) {
                toast.error(
                    e?.response?.data?.error?.message || "Pay membership failed"
                );
            } finally {
                setSubmitting(false);
            }
        },
    });
    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title>Membership payment</Card.Title>
                <form
                    onSubmit={form.handleSubmit}
                    className="row g-2"
                    noValidate
                >
                    <div className="col-sm-3">
                        <label className="form-label">Plan</label>
                        <select
                            name="plan"
                            className="form-select"
                            value={form.values.plan}
                            onChange={form.handleChange}
                        >
                            <option>Basic</option>
                            <option>Premium</option>
                        </select>
                    </div>
                    <div className="col-sm-3">
                        <label className="form-label">Billing cycle</label>
                        <select
                            name="billingCycle"
                            className="form-select"
                            value={form.values.billingCycle}
                            onChange={form.handleChange}
                        >
                            <option value="monthly">monthly</option>
                            <option value="quarterly">quarterly</option>
                        </select>
                    </div>
                    <div className="col-sm-3">
                        <label className="form-label">Amount</label>
                        <input
                            name="amount"
                            type="number"
                            min={0}
                            className={`form-control ${
                                form.touched.amount && form.errors.amount
                                    ? "is-invalid"
                                    : ""
                            }`}
                            value={form.values.amount}
                            onChange={form.handleChange}
                        />
                    </div>
                    <div className="col-sm-2">
                        <label className="form-label">Note</label>
                        <input
                            name="note"
                            className="form-control"
                            value={form.values.note}
                            onChange={form.handleChange}
                        />
                    </div>
                    <div className="col-sm-1 align-self-end">
                        <Button type="submit" disabled={form.isSubmitting}>
                            {form.isSubmitting ? "…" : "Pay"}
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
}
