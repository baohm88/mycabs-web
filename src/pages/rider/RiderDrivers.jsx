import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "../../lib/riders";
import { Table, Form, Button } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import RatingSummary from "../../components/RatingSummary";
import { useSelector } from "react-redux";

export default function RiderDrivers() {
    const { role } = useSelector((s) => s.auth);
    const [sp] = useSearchParams();
    const companyId = sp.get("companyId") || undefined;
    const [q, setQ] = useState("");
    const { data, isLoading } = useQuery({
        queryKey: ["drivers", q, companyId],
        queryFn: () =>
            getDrivers({ page: 1, pageSize: 20, search: q, companyId }),
    });
    const items = data?.items || data?.Items || [];

    const isCompany = role === "Company";

    return (
        <>
            <div className="d-flex gap-2 mb-3">
                <Form.Control
                    placeholder="Search drivers"
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
                            <th>Full Name</th>
                            {isCompany && <th>Email</th>}
                            <th>Company</th>
                            <th>Rating</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((d) => (
                            <tr key={d.id || d.Id}>
                                <td>{d.fullName}</td>
                                {isCompany && <td>{d.email}</td>}
                                <td>{d.companyName || "-"}</td>
                                <td>
                                    <RatingSummary
                                        targetType="driver"
                                        targetId={d.id || d.Id}
                                    />
                                </td>
                                <td className="text-end">
                                    <Link
                                        className="btn btn-sm btn-outline-secondary me-2"
                                        to={`/riders/ratings?targetType=driver&targetId=${
                                            d.id || d.Id
                                        }`}
                                    >
                                        Xem đánh giá
                                    </Link>
                                    <Link
                                        className="btn btn-sm btn-primary"
                                        to={`/riders/rate?targetType=driver&targetId=${
                                            d.id || d.Id
                                        }&name=${encodeURIComponent(
                                            d.fullName
                                        )}`}
                                    >
                                        Đánh giá
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}
