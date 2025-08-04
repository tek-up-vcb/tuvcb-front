import Header from '@/components/Header'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-slate-800">
          About TEK-UP Digital Credentials
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          TEK-UP University leverages blockchain technology to deliver secure, tamper-proof,
          and globally verifiable certifications. Our mission is to empower learners and
          institutions with transparent and trusted digital credentials.
        </p>
      </main>
    </div>
  )
}
