import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "../../lib/drivers";
import DriverHeader from "./DriverHeader";

export default function DriverApplications() {
    const { data, isLoading } = useQuery({
        queryKey: ["driverAppsMe"],
        queryFn: () => getMyApplications({ page: 1, pageSize: 50 }),
    });
    const items = data?.items || data?.Items || [];

    return (
        <>
            <DriverHeader />
            {isLoading ? (
                "Loading…"
            ) : (
                <div className="card">
                    <div className="card-header">Applications</div>
                    <table className="table table-sm mb-0">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Status</th>
                                <th>When</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((a) => (
                                <tr key={a.id || a.Id}>
                                    <td>{a.companyName || a.CompanyName}</td>
                                    <td>{a.status || a.Status}</td>
                                    <td>
                                        {new Date(
                                            a.createdAt || a.CreatedAt
                                        ).toLocaleString()}
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
