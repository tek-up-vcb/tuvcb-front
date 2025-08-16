import Header from '@/components/Header'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          <div className="prose max-w-none">
            {/* Append-only, structured terms content */}
            <p className="text-slate-600">
              These Terms of Service ("Terms") govern your access to and use of the TEK-UP Digital
              Credentials platform (the "Service"). By accessing or using the Service, you agree to be
              bound by these Terms.
            </p>

            <h2>1. Service Description</h2>
            <p>
              The Service enables users to create profiles, request validation of competencies, and
              receive verifiable digital certifications recorded on blockchain and stored via IPFS.
              Certifiers can assess skills and issue credentials. Recruiters may view and verify
              credentials shared by users.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              You must be legally capable of entering into a binding agreement and comply with
              applicable laws. Institutional or certifier access may require additional verification.
            </p>

            <h2>3. Wallets & Authentication</h2>
            <p>
              The Service supports wallet-based authentication (e.g., MetaMask). You are responsible
              for securing your wallet, seed phrase, and devices. We do not store private keys and
              cannot recover them for you.
            </p>

            <h2>4. On-chain Data & Immutability</h2>
            <p>
              Certifications and related metadata may be written to public or consortium blockchains.
              Such records are typically immutable. Please verify information before submitting; errors
              may not be reversible.
            </p>

            <h2>5. Content & Accuracy</h2>
            <p>
              You are responsible for the accuracy of information you submit. Certifiers are
              responsible for the assessments they perform and credentials they issue.
            </p>

            <h2>6. Privacy</h2>
            <p>
              We process personal data in accordance with applicable laws. Certain credential data may
              be publicly verifiable to fulfill the Service’s purpose. Refer to our Privacy Policy for
              details on collection, use, and retention.
            </p>

            <h2>7. Acceptable Use</h2>
            <ul>
              <li>No unlawful, deceptive, or fraudulent activity.</li>
              <li>No infringement of third-party rights or privacy.</li>
              <li>No attempts to disrupt, reverse engineer, or abuse the Service.</li>
            </ul>

            <h2>8. Intellectual Property</h2>
            <p>
              The Service, including software, design, and branding, is owned by TEK-UP University or
              its licensors. Users retain rights in their submitted content, subject to licenses
              necessary to operate the Service.
            </p>

            <h2>9. Disclaimers</h2>
            <p>
              The Service is provided "as is" without warranties of any kind. We do not guarantee that
              every credential will be recognized by all third parties. Blockchain networks are subject
              to risks, fees, and delays outside our control.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, TEK-UP University will not be liable for indirect,
              incidental, special, or consequential damages, or any loss of data, profits, or goodwill
              arising from or related to your use of the Service.
            </p>

            <h2>11. Changes to the Service</h2>
            <p>
              We may modify or discontinue parts of the Service at any time. Material changes to these
              Terms will be communicated through the platform or other reasonable means.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Tunisia, without regard to conflict of laws
              principles. Jurisdiction and venue will be as provided by applicable Tunisian law.
            </p>

            <h2>13. Contact</h2>
            <p>
              For questions about these Terms or the Service, please contact TEK-UP University.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
