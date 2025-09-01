
import { Link } from 'react-router-dom'
import notFoundImg from '../assets/404.png'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <section className="text-center max-w-md">
        <img
          src={notFoundImg}
          alt="404"
          className="mx-auto mb-6 h-48 w-auto opacity-90"
        />
        <h1 className="text-5xl font-bold tracking-tight">404</h1>
        <h2 className="text-3xl font-semibold tracking-tight">Page not found</h2>
        <p className="mt-3 text-muted-foreground">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Return to home
          </Link>
        </div>
      </section>
    </main>
  )
}
