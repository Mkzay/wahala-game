import { Link } from 'react-router-dom'
import { PageShell } from '../components/ui/PageShell'

export default function NotFound() {
  return (
    <PageShell title="Page not found">
      <p className="font-body text-base text-w-text">The route you requested does not exist.</p>
      <Link to="/" className="mt-4 inline-block text-w-yellow underline">
        Back home
      </Link>
    </PageShell>
  )
}
