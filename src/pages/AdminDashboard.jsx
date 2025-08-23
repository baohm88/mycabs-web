// UPDATED: Hoàn chỉnh Dashboard: KPIs + Chart (recharts) + Top Companies/Drivers
// và realtime refresh khi có giao dịch mới (Admin hub)
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "../lib/axios";
import { Row, Col, Card, Table } from "react-bootstrap";
import { adminHub } from "../lib/singalr.js";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts"; // NEW: chart

async function fetchOverview() {
    const res = await api.get("/api/admin/reports/overview");
    return res.data?.data;
}
async function fetchDaily() {
    const res = await api.get("/api/admin/reports/tx-daily");
    return res.data?.data;
}
async function fetchTopCompanies() {
    const res = await api.get("/api/admin/reports/top-companies");
    console.log("TOP COMPANIES: ", res.data?.data);

    return res.data?.data;
}
async function fetchTopDrivers() {
    const res = await api.get("/api/admin/reports/top-drivers");
    console.log(res.data?.data);

    return res.data?.data;
}

export default function AdminDashboard() {
    const { data: ov, refetch: refOv } = useQuery({
        queryKey: ["admin", "overview"],
        queryFn: fetchOverview,
    });
    const { data: daily, refetch: refDaily } = useQuery({
        queryKey: ["admin", "daily"],
        queryFn: fetchDaily,
    });
    const { data: topC, refetch: refTopC } = useQuery({
        queryKey: ["admin", "topC"],
        queryFn: fetchTopCompanies,
    });
    const { data: topD, refetch: refTopD } = useQuery({
        queryKey: ["admin", "topD"],
        queryFn: fetchTopDrivers,
    });

    // NEW: realtime refresh khi có tx mới
    useEffect(() => {
        const conn = adminHub();
        if (!conn) return;
        const onNew = () => {
            refOv();
            refDaily();
            refTopC();
            refTopD();
        };
        conn.on("admin:tx:new", onNew);
        return () => {
            conn.off("admin:tx:new", onNew);
        };
    }, [refOv, refDaily, refTopC, refTopD]);

    const dailyData = (daily || []).map((p) => ({
        date: p.date || p.Date,
        count: p.count ?? p.Count ?? 0,
        amount: p.amount ?? p.Amount ?? 0,
    }));

    const companies = topC || [];
    const drivers = topD || [];

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

            <Row className="g-3">
                <Col md={7}>
                    <Card className="h-100">
                        <Card.Header>Transactions – Daily</Card.Header>
                        <Card.Body style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="left" />
                                    <YAxis
                                        orientation="right"
                                        yAxisId="right"
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        name="Count"
                                        yAxisId="left"
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        name="Amount"
                                        yAxisId="right"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card className="mb-3">
                        <Card.Header>Top Companies</Card.Header>
                        <Table responsive hover size="sm" className="mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th className="text-end">Drivers</th>
                                    <th className="text-end">Tx Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((c, i) => (
                                    <tr key={c.id || c.Id || i}>
                                        <td>{i + 1}</td>
                                        <td>{c.name || c.Name}</td>
                                        <td className="text-end">
                                            {c.driverCount ??
                                                c.DriverCount ??
                                                0}
                                        </td>
                                        <td className="text-end">
                                            {(
                                                c.txAmount ??
                                                c.TxAmount ??
                                                0
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                    <Card>
                        <Card.Header>Top Drivers</Card.Header>
                        <Table responsive hover size="sm" className="mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th className="text-end">Trips</th>
                                    <th className="text-end">Tx Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map((d, i) => (
                                    <tr key={d.id || d.Id || i}>
                                        <td>{i + 1}</td>
                                        <td>{d.fullName || d.FullName}</td>
                                        <td className="text-end">
                                            {d.tripCount ?? d.TripCount ?? 0}
                                        </td>
                                        <td className="text-end">
                                            {(
                                                d.txAmount ??
                                                d.TxAmount ??
                                                0
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
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
