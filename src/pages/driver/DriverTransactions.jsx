import { useQuery } from '@tanstack/react-query'
import { getMyTransactions } from '../../lib/drivers'
import DriverHeader from './DriverHeader'

export default function DriverTransactions(){
  const { data, isLoading } = useQuery({ queryKey:['driverTxMe'], queryFn: ()=>getMyTransactions({ page:1, pageSize:50 }) })
  
  const items = data?.items || data?.Items || []
  return (
    <>
      <DriverHeader />
      {isLoading ? 'Loading…' : (
        <div className="card">
          <div className="card-header">Transactions</div>
          <table className="table table-sm mb-0">
            <thead><tr><th>When</th><th>Type</th><th>Status</th><th className="text-end">Amount</th><th>Note</th></tr></thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id || t.Id}>
                  <td>{new Date(t.createdAt || t.CreatedAt).toLocaleString()}</td>
                  <td>{t.type || t.Type}</td>
                  <td>{t.status || t.Status}</td>
                  <td className="text-end">{(t.amount ?? t.Amount ?? 0).toLocaleString()}</td>
                  <td>{t.note || t.Note || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}