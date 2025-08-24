import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCompanyApplications, approveApplication, rejectApplication } from '../../lib/companies'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import CompanyHeader from './CompanyHeader'

export default function CompanyApplications(){
  const { id } = useParams(); const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey:['companyApps', id], queryFn: ()=>getCompanyApplications(id, { page:1, pageSize:50 }) })
  const items = data?.items || data?.Items || []

  async function doApprove(appId){ try{ await approveApplication(id, appId); toast.success('Approved'); qc.invalidateQueries({ queryKey:['companyApps', id] }) } catch(e){ toast.error('Approve failed') } }
  async function doReject(appId){ try{ await rejectApplication(id, appId); toast.info('Rejected'); qc.invalidateQueries({ queryKey:['companyApps', id] }) } catch(e){ toast.error('Reject failed') } }

  return (
    <>
      <CompanyHeader />
      {isLoading ? 'Loading…' : (
        <div className="card">
          <div className="card-header">Applications</div>
          <table className="table table-sm mb-0">
            <thead><tr><th>Applicant</th><th>DriverId/UserId</th><th>Status</th><th>When</th><th></th></tr></thead>
            <tbody>
              {items.map((a)=>{
                const idKey = a.id || a.Id
                return (
                  <tr key={idKey}>
                    <td>{a.fullName || a.FullName || a.applicantEmail || a.ApplicantEmail}</td>
                    <td>{a.driverId || a.DriverId || a.userId || a.UserId}</td>
                    <td>{a.status || a.Status}</td>
                    <td>{new Date(a.createdAt || a.CreatedAt).toLocaleString()}</td>
                    <td className="text-end">
                      <Button size="sm" variant="success" className="me-2" onClick={()=>doApprove(idKey)}>Approve</Button>
                      <Button size="sm" variant="outline-danger" onClick={()=>doReject(idKey)}>Reject</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}