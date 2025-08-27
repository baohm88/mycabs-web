import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOpenings, applyToOpening } from "../../lib/drivers";
import { Table, Form, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import DriverHeader from "./DriverHeader";

export default function DriverOpenings() {
    const qc = useQueryClient();
    const [q, setQ] = useState("");
    const [type, setType] = useState("");
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["drvOpenings", q, type],
        queryFn: () =>
            getOpenings({
                page: 1,
                pageSize: 20,
                search: q || undefined,
                serviceType: type || undefined,
            }),
    });
    const items = data?.items || data?.Items || [];

    async function doApply(o) {
        const companyId =
            o.companyId || o.CompanyId || o.company?.id || o.Company?.Id;
        try {
            const res = await applyToOpening({ companyId });

            toast.success(res.message);
            qc.invalidateQueries({ queryKey: ["driverAppsMe"] });
        } catch (e) {
            toast.error(e?.response?.data?.error?.message || "Apply failed");
        }
    }

    return (
        <>
            <DriverHeader />
            <div className="d-flex gap-2 mb-3">
                <Form.Control
                    placeholder="Tìm company"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ maxWidth: 200 }}
                >
                    <option value="">All types</option>
                    <option value="taxi">taxi</option>
                    <option value="xe_om">xe_om</option>
                    <option value="hang_hoa">hang_hoa</option>
                    <option value="tour">tour</option>
                </Form.Select>
                <Button onClick={() => refetch()}>Search</Button>
            </div>

            {isLoading ? (
                "Loading…"
            ) : (
                <Table responsive hover size="sm">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Plan</th>
                            <th>Services</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((o) => (
                            <tr key={o.companyId || o.CompanyId}>
                                <td>
                                    <div className="fw-semibold">
                                        {o.name || o.Name}
                                    </div>
                                    <div className="small text-muted">
                                        {o.address || o.Address || ""}
                                    </div>
                                </td>
                                <td>{o.plan || o.Plan}</td>
                                <td className="small">
                                    {(o.services || o.Services || []).map(
                                        (s, i) => (
                                            <Badge
                                                bg="secondary"
                                                className="me-1"
                                                key={i}
                                            >
                                                {s.type || s.Type}
                                            </Badge>
                                        )
                                    )}
                                </td>
                                <td className="text-end">
                                    {o.canApply ? (
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => doApply(o)}
                                        >
                                            Apply
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            disabled
                                        >
                                            Not eligible
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}
