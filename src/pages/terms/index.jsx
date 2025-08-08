import Header from '@/components/Header'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <div className="prose max-w-none">
            <p>Terms and conditions content will be added here.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
