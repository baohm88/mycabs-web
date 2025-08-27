import { useQuery } from "@tanstack/react-query";
import { getMyWallet } from "../../lib/drivers";
import { Card } from "react-bootstrap";
import DriverHeader from "./DriverHeader";

export default function DriverWallet() {
    const { data } = useQuery({
        queryKey: ["driverWalletMe"],
        queryFn: () => getMyWallet(),
    });

    const w = data || {};
    return (
        <>
            <DriverHeader />
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="text-muted">Wallet ID</div>
                            <div className="fw-bold">{w.id || w.Id}</div>
                        </div>
                        <div className="text-end">
                            <div className="text-muted">Balance</div>
                            <div className="display-6">
                                {(w.balance ?? w.Balance ?? 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}
