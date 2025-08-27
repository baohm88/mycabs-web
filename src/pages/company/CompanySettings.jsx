import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getMyCompany, updateMyCompany } from "../../lib/companies";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CompanySettings() {
    const navigate = useNavigate();
    const role = useSelector((s) => s.auth.user?.role);
    const [loading, setLoading] = useState(true);
    const [model, setModel] = useState({
        name: "",
        description: "",
        address: "",
        membership: null,
        services: [],
    });

    useEffect(() => {
        (async () => {
            try {
                const c = await getMyCompany();
                setModel({
                    name: c?.name || "",
                    description: c?.description || "",
                    address: c?.address || "",
                    membership: c?.membership || null,
                    services: c?.services || [],
                });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (role !== "Company") return <div>Chỉ dành cho Company</div>;
    if (loading) return <div>Loading…</div>;

    function setField(k, v) {
        setModel((m) => ({ ...m, [k]: v }));
    }
    function addService() {
        setModel((m) => ({
            ...m,
            services: [
                ...m.services,
                { serviceId: "", type: "taxi", title: "", basePrice: 0 },
            ],
        }));
    }
    function updateService(i, k, v) {
        setModel((m) => {
            const arr = m.services.slice();
            arr[i] = { ...arr[i], [k]: k === "basePrice" ? Number(v) : v };
            return { ...m, services: arr };
        });
    }
    function removeService(i) {
        setModel((m) => ({
            ...m,
            services: m.services.filter((_, idx) => idx !== i),
        }));
    }

    async function onSave() {
        try {
            const payload = {
                name: model.name || undefined,
                description: model.description ?? undefined,
                address: model.address ?? undefined,
                // services: nếu muốn replace toàn bộ list
                services: model.services?.map((s) => ({
                    serviceId: s.serviceId || undefined,
                    type: s.type,
                    title: s.title,
                    basePrice: Number(s.basePrice || 0),
                })),
                // membership: optional (nếu muốn cho tự sửa)
                membership: model.membership
                    ? {
                          plan: model.membership.plan,
                          billingCycle: model.membership.billingCycle,
                          expiresAt: model.membership.expiresAt || null,
                      }
                    : undefined,
            };
            const updated = await updateMyCompany(payload);
            setModel({
                name: updated?.name || "",
                description: updated?.description || "",
                address: updated?.address || "",
                membership: updated?.membership || null,
                services: updated?.services || [],
            });
            toast.success("Company profile saved successfully!");
            navigate("/profile");
        } catch (e) {
            toast.error(e?.response?.data?.error?.message || "Lưu thất bại");
        }
    }

    return (
        <Card>
            <Card.Body>
                <Card.Title>Company Settings</Card.Title>

                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input
                            className="form-control"
                            value={model.name}
                            onChange={(e) => setField("name", e.target.value)}
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            value={model.description}
                            onChange={(e) =>
                                setField("description", e.target.value)
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Address</label>
                        <input
                            className="form-control"
                            value={model.address}
                            onChange={(e) =>
                                setField("address", e.target.value)
                            }
                        />
                    </div>

                    {/* Membership (optional) */}
                    <div className="col-12">
                        <div className="fw-semibold">Membership</div>
                    </div>
                    <div className="col-sm-3">
                        <label className="form-label">Plan</label>
                        <select
                            className="form-select"
                            value={model.membership?.plan || "Free"}
                            onChange={(e) =>
                                setField("membership", {
                                    ...(model.membership || {}),
                                    plan: e.target.value,
                                })
                            }
                        >
                            <option>Free</option>
                            <option>Basic</option>
                            <option>Premium</option>
                        </select>
                    </div>
                    <div className="col-sm-3">
                        <label className="form-label">Billing cycle</label>
                        <select
                            className="form-select"
                            value={model.membership?.billingCycle || "monthly"}
                            onChange={(e) =>
                                setField("membership", {
                                    ...(model.membership || {}),
                                    billingCycle: e.target.value,
                                })
                            }
                        >
                            <option value="monthly">monthly</option>
                            <option value="quarterly">quarterly</option>
                        </select>
                    </div>
                    <div className="col-sm-3">
                        <label className="form-label">Expires at</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={
                                model.membership?.expiresAt
                                    ? new Date(model.membership.expiresAt)
                                          .toISOString()
                                          .slice(0, 16)
                                    : ""
                            }
                            onChange={(e) =>
                                setField("membership", {
                                    ...(model.membership || {}),
                                    expiresAt: e.target.value
                                        ? new Date(e.target.value).toISOString()
                                        : null,
                                })
                            }
                        />
                    </div>

                    {/* Services */}
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <div className="fw-semibold">Services</div>
                        <Button size="sm" onClick={addService}>
                            + Add
                        </Button>
                    </div>
                    <div className="col-12">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th style={{ width: 120 }}>Type</th>
                                    <th>Title</th>
                                    <th
                                        style={{ width: 160 }}
                                        className="text-end"
                                    >
                                        Base price
                                    </th>
                                    <th style={{ width: 80 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {model.services.map((s, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={s.type}
                                                onChange={(e) =>
                                                    updateService(
                                                        i,
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="taxi">
                                                    taxi
                                                </option>
                                                <option value="xe_om">
                                                    xe_om
                                                </option>
                                                <option value="hang_hoa">
                                                    hang_hoa
                                                </option>
                                                <option value="tour">
                                                    tour
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                className="form-control form-control-sm"
                                                value={s.title}
                                                onChange={(e) =>
                                                    updateService(
                                                        i,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min={0}
                                                className="form-control form-control-sm text-end"
                                                value={s.basePrice}
                                                onChange={(e) =>
                                                    updateService(
                                                        i,
                                                        "basePrice",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="text-end">
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => removeService(i)}
                                            >
                                                x
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="col-12">
                        <Button onClick={onSave}>Save changes</Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}
