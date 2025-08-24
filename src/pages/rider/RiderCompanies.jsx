import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCompanies } from "../../lib/riders";
import { Table, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import RatingSummary from "../../components/RatingSummary";

export default function RiderCompanies() {
    const [q, setQ] = useState("");
    const { data, isLoading } = useQuery({
        queryKey: ["companies", q],
        queryFn: () => getCompanies({ page: 1, pageSize: 20, search: q }),
    });
    const items = data?.items || data?.Items || [];

    return (
        <>
            <div className="d-flex gap-2 mb-3">
                <Form.Control
                    placeholder="Search companies"
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
                            <th>Name</th>
                            <th>Plan</th>
                            <th>Rating</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((c) => (
                            <tr key={c.id || c.Id}>
                                <td>{c.name || c.Name}</td>
                                <td>
                                    {c.membership?.plan ||
                                        c.Membership?.Plan ||
                                        "-"}
                                </td>
                                <td>
                                    <RatingSummary
                                        targetType="company"
                                        targetId={c.id || c.Id}
                                    />
                                </td>
                                <td className="text-end">
                                    <Link
                                        className="btn btn-sm btn-outline-secondary me-2"
                                        to={`/riders/ratings?targetType=company&targetId=${
                                            c.id || c.Id
                                        }`}
                                    >
                                        Xem đánh giá
                                    </Link>
                                    <Link
                                        className="btn btn-sm btn-primary"
                                        to={`/riders/rate?targetType=company&targetId=${
                                            c.id || c.Id
                                        }&name=${encodeURIComponent(
                                            c.name || c.Name
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
