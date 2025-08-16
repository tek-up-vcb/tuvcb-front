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
        {/* Additional professional content (append-only) */}
        <div className="mt-12 w-full max-w-4xl text-left">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-800">Our Mission</h2>
            <p className="mt-3 text-slate-600">
              We aim to create a secure, transparent, and decentralized platform that validates
              professional skills, issues tamper-proof certifications on blockchain, and
              strengthens trust between candidates, recruiters, and institutions.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-800">Who We Serve</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
              <li><strong>Professionals:</strong> manage profiles and request competency validation.</li>
              <li><strong>Certifiers:</strong> assess skills and issue on-chain certifications.</li>
              <li><strong>Recruiters:</strong> search verified profiles and filter by certified skills.</li>
            </ul>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-slate-800">Academic Excellence at TEK-UP</h2>
            <p className="mt-3 text-slate-600">
              TEK-UP University, based in Tunisia, is approved by the Ministry of Higher Education and
              Scientific Research (MESRS) since 2014. The institution is authorized to award two national
              engineering degrees: Computer Science and Telecommunications. Our educational model blends
              rigorous academic training with practical, industry-aligned experiences.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
              <li>ICT integrated preparatory cycle for engineers (2 years).</li>
              <li>National engineering diploma in Computer Science (3 years).</li>
              <li>Admission pathways for M1 holders or students completing the first engineering year.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-800">Technology & Features</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-600">
              <li>Smart contracts record validations immutably.</li>
              <li>IPFS-backed storage for certification assets.</li>
              <li>MetaMask integration for seamless login.</li>
              <li>AI-assisted diploma verification from a photo.</li>
              <li>Transparent history and verifiable proof links.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
