import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getInvitations, createInvitation } from '../../lib/companies'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Card, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import CompanyHeader from './CompanyHeader'

export default function CompanyInvitations(){
  const { id } = useParams(); const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey:['companyInvites', id], queryFn: ()=>getInvitations(id, { page:1, pageSize:50 }) })
  const items = data?.items || data?.Items || []

  const form = useFormik({ initialValues: { email:'', note:'' },
    validationSchema: Yup.object({ email: Yup.string().email('Invalid').required('Required') }),
    onSubmit: async (v,{setSubmitting, resetForm}) => {
      try{ await createInvitation(id, v); toast.success('Invitation sent'); resetForm(); qc.invalidateQueries({ queryKey:['companyInvites', id] }) }
      catch(e){ toast.error(e?.response?.data?.error?.message || 'Invite failed') }
      finally{ setSubmitting(false) }
    }
  })

  return (
    <>
      <CompanyHeader />
      <Card className="mb-3"><Card.Body>
        <Card.Title>Invite by email</Card.Title>
        <form onSubmit={form.handleSubmit} className="row g-2" noValidate>
          <div className="col-sm-5"><label className="form-label">Email</label>
            <input name="email" type="email" className={`form-control ${form.touched.email && form.errors.email?'is-invalid':''}`} value={form.values.email} onChange={form.handleChange} />
          </div>
          <div className="col-sm-5"><label className="form-label">Note</label>
            <input name="note" className="form-control" value={form.values.note} onChange={form.handleChange} />
          </div>
          <div className="col-sm-2 align-self-end"><Button type="submit" disabled={form.isSubmitting}>{form.isSubmitting?'…':'Send'}</Button></div>
        </form>
      </Card.Body></Card>

      {isLoading ? 'Loading…' : (
        <div className="card">
          <div className="card-header">Invitations</div>
          <table className="table table-sm mb-0">
            <thead><tr><th>Email</th><th>Status</th><th>When</th></tr></thead>
            <tbody>
              {items.map((iv,i)=> (
                <tr key={iv.id || iv.Id || i}>
                  <td>{iv.email || iv.Email}</td>
                  <td>{iv.status || iv.Status}</td>
                  <td>{new Date(iv.createdAt || iv.CreatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}