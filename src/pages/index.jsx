import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, File, GraduationCap, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex flex-1 flex-col">
        <section className="container mx-auto flex flex-col items-center gap-12 px-4 py-20 md:flex-row">
          <div className="flex flex-1 flex-col items-center gap-6 text-center md:items-start md:text-left">
            <h1 className="text-5xl font-bold text-slate-800 md:text-6xl">
              TEK-UP Digital Credentials
            </h1>
            <p className="text-xl text-slate-600">
              Unlock the future of education with secure, verifiable, and decentralized
              certifications.
            </p>
            <div className="flex gap-4">
              <Button className="bg-blue-700 text-white hover:bg-blue-800">
                Connect Wallet
              </Button>
              <Button variant="outline">How It Works</Button>
            </div>
          </div>
          <div className="relative flex flex-1 justify-center">
            <div className="relative w-60 rotate-6 rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <span className="text-sm font-semibold text-green-600">
                  Certification Validated
                </span>
                <span className="text-xl font-bold">TEK-UP</span>
                <span className="text-4xl">🎉</span>
              </div>
            </div>
            <div className="absolute -left-24 top-1/2 flex -rotate-12 items-center">
              <ArrowRight className="h-8 w-8" />
              <span className="ml-2 font-medium italic">
                Keep your diplomas safe and secure !
              </span>
            </div>
          </div>
        </section>
        <hr className="border-t" />
        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="flex items-center justify-center gap-2 text-3xl font-semibold text-slate-800">
            <GraduationCap className="h-8 w-8 text-blue-700" />
            Certify, Trust, and Showcase with Blockchain Power
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            Say goodbye to paper diplomas and unverifiable certificates. TEK-UP now
            offers a cutting-edge solution to issue digital credentials that are secure,
            tamper-proof, and instantly verifiable worldwide.
          </p>
        </section>
        <section className="bg-indigo-100 py-16">
          <div className="container mx-auto flex flex-col gap-8 px-4 md:flex-row">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold">What Is It?</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <GraduationCap className="mt-1 h-5 w-5 text-blue-700" />
                  <span>Receive official diplomas and certifications directly on the blockchain</span>
                </li>
                <li className="flex items-start gap-2">
                  <GraduationCap className="mt-1 h-5 w-5 text-blue-700" />
                  <span>Prove competencies with full transparency and zero fraud</span>
                </li>
                <li className="flex items-start gap-2">
                  <GraduationCap className="mt-1 h-5 w-5 text-blue-700" />
                  <span>Share their credentials with recruiters in just one click</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-1 flex-wrap justify-center gap-4 md:justify-end">
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-lg bg-white text-slate-600 shadow">
                <Lock className="mb-2 h-8 w-8" />
                <p className="text-center text-sm font-medium">Powered by Blockchain</p>
              </div>
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-lg bg-slate-800 text-white shadow">
                <Check className="mb-2 h-8 w-8 text-green-400" />
                <p className="text-center text-sm font-medium">Validated by Experts</p>
              </div>
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-lg bg-slate-800 text-white shadow">
                <File className="mb-2 h-8 w-8 text-blue-300" />
                <p className="text-center text-sm font-medium">Stored on IPFS</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
