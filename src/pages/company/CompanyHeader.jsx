import { useQuery } from "@tanstack/react-query";
import { getCompany } from "../../lib/companies";
import { Link, useParams, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function CompanyHeader() {
    const { id } = useParams();
    const loc = useLocation();
    const { data } = useQuery({
        queryKey: ["company", id],
        queryFn: () => getCompany(id),
    });
    const c = data || {};
    const tab = (path, label) => (
        <Button
            as={Link}
            to={path}
            size="sm"
            variant={loc.pathname === path ? "primary" : "outline-primary"}
            className="me-2"
        >
            {label}
        </Button>
    );
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
                <div className="h5 mb-0">
                    {c.name || c.Name}{" "}
                    <small className="text-muted">#{c.id || c.Id}</small>
                </div>
                <div className="small text-muted">
                    {c.address || c.Address || ""}
                </div>
            </div>
            <div className="text-nowrap">
                {tab(`/companies/${id}/services`, "Services")}
                {tab(`/companies/${id}/wallet`, "Wallet")}
                {tab(`/companies/${id}/transactions`, "Transactions")}
                {tab(`/companies/${id}/applications`, "Applications")}
                {tab(`/companies/${id}/invitations`, "Invitations")}
            </div>
        </div>
    );
}
