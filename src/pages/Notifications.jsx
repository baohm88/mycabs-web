import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../lib/axios";
import { Table, Button, Stack, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

async function fetchList() {
    const res = await api.get("/api/notifications?page=1&pageSize=20");
    return res.data?.data;
}

async function markAll() {
    const res = await api.post("/api/notifications/mark-all-read");
    return res.data?.data;
}

export default function Notifications() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["notifs"],
        queryFn: fetchList,
    });
    const m = useMutation({
        mutationFn: markAll,
        onSuccess: () => {
            toast.success("Marked all as read");
            refetch();
        },
    });

    if (isLoading) return <div>Loading…</div>;
    const items = data?.items || data?.Items || [];

    return (
        <Stack gap={3}>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="m-0">Notifications</h5>
                <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => m.mutate()}
                    disabled={m.isPending}
                >
                    Mark all read
                </Button>
            </div>
            <Table responsive hover size="sm">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Title / Message</th>
                        <th>When</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((n) => {
                        const isRead = !!n.readAt || n.isRead;
                        return (
                            <tr key={n.id || n.Id}>
                                <td>
                                    <Badge
                                        bg={isRead ? "secondary" : "primary"}
                                    >
                                        {n.type || n.Type}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="fw-semibold">
                                        {n.title || n.Title}
                                    </div>
                                    <div className="text-muted small">
                                        {n.message || n.Message}
                                    </div>
                                </td>
                                <td className="text-nowrap">
                                    {dayjs(
                                        n.createdAt || n.CreatedAt
                                    ).fromNow?.() ||
                                        dayjs(
                                            n.createdAt || n.CreatedAt
                                        ).format("YYYY-MM-DD HH:mm")}
                                </td>
                                <td></td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </Stack>
    );
}
