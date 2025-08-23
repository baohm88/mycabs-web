import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";
import { Row, Col, Card, Table } from "react-bootstrap";

async function fetchOverview() {
    const res = await api.get("/api/admin/reports/overview");
    return res.data?.data;
}
async function fetchDaily() {
    const res = await api.get("/api/admin/reports/tx-daily");
    return res.data?.data;
}

export default function AdminDashboard() {
    const { data: ov } = useQuery({
        queryKey: ["admin", "overview"],
        queryFn: fetchOverview,
    });
    const { data: daily } = useQuery({
        queryKey: ["admin", "daily"],
        queryFn: fetchDaily,
    });

    return (
        <>
            <Row className="g-3 mb-3">
                <Col xs={6} md={3}>
                    <Kpi title="Users" value={ov?.usersTotal ?? 0} />
                </Col>
                <Col xs={6} md={3}>
                    <Kpi title="Companies" value={ov?.companiesTotal ?? 0} />
                </Col>
                <Col xs={6} md={3}>
                    <Kpi title="Drivers" value={ov?.driversTotal ?? 0} />
                </Col>
                <Col xs={6} md={3}>
                    <Kpi
                        title="Tx Amount"
                        value={(ov?.txAmount ?? 0).toLocaleString()}
                    />
                </Col>
            </Row>
            <Card>
                <Card.Header>Transactions – Daily</Card.Header>
                <Table responsive size="sm" className="mb-0">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th className="text-end">Count</th>
                            <th className="text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(daily || []).map((p) => (
                            <tr key={p.date || p.Date}>
                                <td>{p.date || p.Date}</td>
                                <td className="text-end">
                                    {p.count ?? p.Count}
                                </td>
                                <td className="text-end">
                                    {(p.amount ?? p.Amount).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </>
    );
}

function Kpi({ title, value }) {
    return (
        <Card className="card-kpi">
            <Card.Body>
                <div className="text-muted small">{title}</div>
                <div className="fs-4 fw-bold">{value}</div>
            </Card.Body>
        </Card>
    );
}
