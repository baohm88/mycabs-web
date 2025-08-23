import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRatings } from '../lib/riders'
import { Table } from 'react-bootstrap'

export default function Ratings(){
  const [sp] = useSearchParams(); const targetType = sp.get('targetType') || 'company'; const targetId = sp.get('targetId') || ''
  const { data, isLoading } = useQuery({ queryKey:['ratings', targetType, targetId], queryFn: ()=>getRatings({ targetType, targetId, page:1, pageSize:20 }) })
  const items = data?.items || data?.Items || []
  return isLoading ? 'Loading…' : (
    <Table responsive hover size="sm">
      <thead><tr><th>Stars</th><th>Comment</th><th>When</th></tr></thead>
      <tbody>
        {items.map(r => (
          <tr key={r.id || r.Id}><td>{r.stars || r.Stars}</td><td>{r.comment || r.Comment}</td><td>{new Date(r.createdAt || r.CreatedAt).toLocaleString()}</td></tr>
        ))}
      </tbody>
    </Table>
  )
}