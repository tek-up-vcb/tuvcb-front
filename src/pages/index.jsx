import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, File, GraduationCap, Lock, ShieldCheck, Wallet, Image, Search, FileCheck } from "lucide-react";
import heroImg from "@/assets/hero.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthService from "@/lib/authService";
import schoolBanner from "@/assets/school.jpg";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated())
  }, [])
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex flex-1 flex-col items-center">
        <section className="flex w-full max-w-5xl flex-col items-center gap-12 px-4 py-20 md:flex-row">
          <div className="flex flex-1 flex-col items-center gap-6 text-center md:items-start md:text-left">
            <h1 className="text-5xl font-bold text-slate-800 md:text-6xl">
              TEK-UP Digital Credentials
            </h1>
            <p className="text-xl text-slate-600">
              Unlock the future of education with secure, verifiable, and
              decentralized certifications.
            </p>
            <div className="flex gap-4">
              <Button
                asChild
                className="bg-blue-700 text-white hover:bg-blue-800 border-0 shadow-sm"
              >
                {isAuthenticated ? (
                  <Link to="/dashboard">Go to Dashboard</Link>
                ) : (
                  <Link to="/login">Connect Wallet</Link>
                )}
              </Button>
              <Button variant="outline" className="border-0 shadow-sm">How It Works</Button>
            </div>
          </div>
          <div className="relative flex flex-1 justify-center">
            <img
              src={heroImg}
              alt="Phone showing verified credential"
              className="w-60 rotate-6"
            />
          </div>
        </section>
        <hr className="w-full max-w-5xl border-0 bg-gray-200 h-px" />
        <section className="w-full max-w-5xl px-4 py-16 text-center">
          <h2 className="flex items-center justify-center gap-2 text-3xl font-semibold text-slate-800">
            <GraduationCap className="h-8 w-8 text-blue-700" />
            Certify, Trust, and Showcase with Blockchain Power
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            Say goodbye to paper diplomas and unverifiable certificates. TEK-UP
            now offers a cutting-edge solution to issue digital credentials that
            are secure, tamper-proof, and instantly verifiable worldwide.
          </p>
        </section>
        <section className="w-full bg-indigo-100 py-16">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 md:flex-row">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold">What Is It?</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <GraduationCap className="mt-1 h-5 w-5 text-blue-700" />
                  <span>
                    Receive official diplomas and certifications directly on the
                    blockchain
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <GraduationCap className="mt-1 h-5 w-5 text-blue-700" />
                  <span>
                    Prove competencies with full transparency and zero fraud
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <GraduationCap className="mt-1 h-5 w-5 text-blue-700" />
                  <span>
                    Share their credentials with recruiters in just one click
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex flex-1 flex-wrap justify-center gap-4 md:justify-end">
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm border-0">
                <Lock className="mb-2 h-8 w-8" />
                <p className="text-center text-sm font-medium">
                  Powered by Blockchain
                </p>
              </div>
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-lg bg-slate-800 text-white shadow-sm border-0">
                <Check className="mb-2 h-8 w-8 text-green-400" />
                <p className="text-center text-sm font-medium">
                  Validated by Experts
                </p>
              </div>
              <div className="flex h-36 w-36 flex-col items-center justify-center rounded-lg bg-slate-800 text-white shadow-sm border-0">
                <File className="mb-2 h-8 w-8 text-blue-300" />
                <p className="text-center text-sm font-medium">
                  Stored on IPFS
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Audience Section */}
        <section className="w-full max-w-5xl px-4 py-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Who is it for?</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-lg font-semibold">Professionals</h4>
              <p className="text-slate-600 text-sm">
                Manage your profile, request competency validation, and showcase
                verifiable achievements to employers worldwide.
              </p>
            </div>
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-lg font-semibold">Certifiers</h4>
              <p className="text-slate-600 text-sm">
                Evaluate skills, issue tamper-proof digital certifications, and
                maintain transparent validation records.
              </p>
            </div>
            <div className="rounded-lg border-0 bg-white p-6 shadow-sm">
              <h4 className="mb-2 text-lg font-semibold">Recruiters</h4>
              <p className="text-slate-600 text-sm">
                Search validated profiles, filter by certified skills, and trust
                credentials at a glance.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section (with school banner background) */}
        <section
          className="w-full relative py-16 md:py-20"
          style={{
            backgroundImage: `url(${schoolBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            minHeight: "360px",
          }}
        >
          <div className="absolute inset-0 bg-white/80 md:bg-white/70" />
          <div className="relative mx-auto w-full max-w-5xl px-4">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">How it works</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-lg border-0 bg-slate-50 p-6 shadow-sm">
                <Wallet className="mb-3 h-6 w-6 text-blue-700" />
                <h5 className="font-semibold">1. Connect</h5>
                <p className="text-sm text-slate-600">Sign in with MetaMask and create your profile.</p>
              </div>
              <div className="rounded-lg border-0 bg-slate-50 p-6 shadow-sm">
                <Search className="mb-3 h-6 w-6 text-blue-700" />
                <h5 className="font-semibold">2. Validate</h5>
                <p className="text-sm text-slate-600">Request validation of skills and diplomas.</p>
              </div>
              <div className="rounded-lg border-0 bg-slate-50 p-6 shadow-sm">
                <FileCheck className="mb-3 h-6 w-6 text-blue-700" />
                <h5 className="font-semibold">3. Certify</h5>
                <p className="text-sm text-slate-600">Certifiers issue on-chain credentials via smart contracts.</p>
              </div>
              <div className="rounded-lg border-0 bg-slate-50 p-6 shadow-sm">
                <ShieldCheck className="mb-3 h-6 w-6 text-blue-700" />
                <h5 className="font-semibold">4. Share</h5>
                <p className="text-sm text-slate-600">Share a verifiable proof link with employers securely.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full max-w-5xl px-4 py-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Key features</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-lg border-0 bg-white p-5 shadow-sm">
              <ShieldCheck className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <h5 className="font-semibold">Tamper-proof and transparent</h5>
                <p className="text-sm text-slate-600">All validations are recorded on blockchain and certificates stored on IPFS.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border-0 bg-white p-5 shadow-sm">
              <Wallet className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <h5 className="font-semibold">MetaMask integration</h5>
                <p className="text-sm text-slate-600">Fast, secure wallet-based login for a seamless experience.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border-0 bg-white p-5 shadow-sm">
              <Image className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <h5 className="font-semibold">AI diploma verification</h5>
                <p className="text-sm text-slate-600">Verify a diploma using only its photo with built-in AI checks.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border-0 bg-white p-5 shadow-sm">
              <File className="mt-1 h-6 w-6 text-blue-700" />
              <div>
                <h5 className="font-semibold">Portable credentials</h5>
                <p className="text-sm text-slate-600">Share proof with a link or QR code—instantly verifiable globally.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Compliance Section */}
        <section className="w-full bg-slate-50 py-16">
          <div className="mx-auto w-full max-w-5xl px-4 text-center">
            <p className="text-sm uppercase tracking-wide text-slate-500">Trust & Compliance</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-800">Backed by TEK-UP University, Tunisia</h3>
            <p className="mx-auto mt-3 max-w-3xl text-slate-600">
              TEK-UP University is approved by the Tunisian Ministry of Higher Education and Scientific
              Research (MESRS) and authorized to award national engineering degrees in Computer Science
              and Telecommunications. Our platform extends that academic rigor to the digital world.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
