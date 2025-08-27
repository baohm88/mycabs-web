import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyInvitations, respondInvitation } from "../../lib/drivers";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import DriverHeader from "./DriverHeader";

export default function DriverInvitations() {
    const qc = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["driverInvitesMe"],
        queryFn: () => getMyInvitations({ page: 1, pageSize: 50 }),
    });
    const items = data?.items || data?.Items || [];

    async function respond(id, accept) {
        try {
            await respondInvitation(id, accept);
            toast.success(accept ? "Accepted" : "Declined");
            qc.invalidateQueries({ queryKey: ["driverInvitesMe"] });
        } catch (e) {
            toast.error("Respond failed");
        }
    }

    return (
        <>
            <DriverHeader />
            {isLoading ? (
                "Loading…"
            ) : (
                <div className="card">
                    <div className="card-header">Invitations</div>
                    <table className="table table-sm mb-0">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Note</th>
                                <th>Status</th>
                                <th>When</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((iv) => (
                                <tr key={iv.id || iv.Id}>
                                    <td>{iv.companyName || iv.CompanyName}</td>
                                    <td>{iv.note || iv.Note || ""}</td>
                                    <td>{iv.status || iv.Status}</td>
                                    <td>
                                        {new Date(
                                            iv.createdAt || iv.CreatedAt
                                        ).toLocaleString()}
                                    </td>
                                    <td className="text-end">
                                        <Button
                                            size="sm"
                                            variant="success"
                                            className="me-2"
                                            onClick={() =>
                                                respond(iv.id || iv.Id, true)
                                            }
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() =>
                                                respond(iv.id || iv.Id, false)
                                            }
                                        >
                                            Decline
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
