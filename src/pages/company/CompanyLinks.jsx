import { Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

function CompanyLinks({ companyId }) {
    return (
        <>
            <NavDropdown.Item as={Link} to={`/companies/${companyId}/services`}>
                Services
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to={`/companies/${companyId}/wallet`}>
                Wallet
            </NavDropdown.Item>
            <NavDropdown.Item
                as={Link}
                to={`/companies/${companyId}/transactions`}
            >
                Transactions
            </NavDropdown.Item>
            <NavDropdown.Item
                as={Link}
                to={`/companies/${companyId}/applications`}
            >
                Applications
            </NavDropdown.Item>
            <NavDropdown.Item
                as={Link}
                to={`/companies/${companyId}/invitations`}
            >
                Invitations
            </NavDropdown.Item>
        </>
    );
}

export default CompanyLinks;
