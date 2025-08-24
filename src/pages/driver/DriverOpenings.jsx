import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOpenings, applyToOpening } from "../../lib/drivers";
import { Table, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import DriverHeader from "./DriverHeader";

export default function DriverOpenings() {
    const [q, setQ] = useState("");
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["driverOpenings", q],
        queryFn: () => getOpenings({ page: 1, pageSize: 20, search: q }),
    });
    const items = data?.items || data?.Items || [];

    console.log("OPENINGS: ", items);

    async function doApply(o) {
        const openingId = o.id || o.openingId || o.OpeningId || o.Id;
        const companyId =
            o.companyId || o.CompanyId || o.company?.id || o.Company?.Id;
        try {
            await applyToOpening({ openingId, companyId });
            toast.success("Ứng tuyển thành công");
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
                    placeholder="Search openings"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <Button onClick={() => {}}>Search</Button>
            </div>
            {isLoading ? (
                "Loading…"
            ) : (
                <Table responsive hover size="sm">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th className="text-end">Base Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((o) => (
                            <tr key={o.id || o.Id}>
                                <td>
                                    {o.name}
                                </td>
                                <td>{o.description}</td>
                                <td>{o.type || o.Type}</td>
                                <td className="text-end">
                                    {(
                                        o.basePrice ??
                                        o.BasePrice ??
                                        0
                                    ).toLocaleString()}
                                </td>
                                <td className="text-end">
                                    <Button
                                        size="sm"
                                        onClick={() => doApply(o)}
                                    >
                                        Apply
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}
