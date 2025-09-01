
import { useState, useEffect } from 'react';
import { keccak256 } from 'js-sha3';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import AuthService from '@/lib/authService';
import { useNavigate } from 'react-router-dom';

export default function CheckDiplomaPage() {
  const [root, setRoot] = useState('');
  const [hash, setHash] = useState('');
  const [proof, setProof] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [isAuthenticated, setIsAuthenticated] = useState(false); // unused
  const navigate = useNavigate();

  // useEffect(() => {
  //   setIsAuthenticated(AuthService.isAuthenticated());
  // }, []);

  const handleReset = () => {
    setRoot('');
    setHash('');
    setProof('');
    setResult(null);
    setError(null);
  };

  const handleVerify = () => {
    setError(null);
    setResult(null);
    setLoading(true);
    let parsedProof = [];
    try {
      parsedProof = JSON.parse(proof);
      if (!Array.isArray(parsedProof)) throw new Error();
    } catch {
  setError('Invalid Merkle proof (expected JSON array)');
      setLoading(false);
      return;
    }
    let current = hash.trim();
    for (const step of parsedProof) {
      if (step.position === 'left') {
        current = keccak256(step.hash + current);
      } else if (step.position === 'right') {
        current = keccak256(current + step.hash);
      } else {
  setError('Invalid proof step: missing or invalid position');
        setLoading(false);
        return;
      }
    }
    if (current === root.trim()) {
      setResult('Diploma is valid (Merkle proof verified)');
    } else {
      setResult('Diploma is invalid (incorrect Merkle proof)');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <section className="w-full max-w-lg bg-white rounded shadow p-6">
          <button
            className="mb-4 flex items-center text-slate-600 hover:text-slate-900"
            type="button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-green-600" /> Check a diploma
          </h1>
          <p className="mb-6 text-slate-600">Verify the authenticity of a diploma using a Merkle proof.</p>
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleVerify(); }}>
            <div>
              <label htmlFor="merkle-root" className="block text-sm font-medium text-slate-700 mb-1">Merkle Root</label>
              <Input
                id="merkle-root"
                placeholder="e.g. 0x..."
                value={root}
                onChange={e => setRoot(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label htmlFor="diploma-hash" className="block text-sm font-medium text-slate-700 mb-1">Diploma Hash</label>
              <Input
                id="diploma-hash"
                placeholder="e.g. 0x..."
                value={hash}
                onChange={e => setHash(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div>
              <label htmlFor="merkle-proof" className="block text-sm font-medium text-slate-700 mb-1">Merkle Proof (JSON array)</label>
              <Textarea
                id="merkle-proof"
                value={proof}
                onChange={e => setProof(e.target.value)}
                rows={6}
                spellCheck={false}
              />
              <div className="text-xs text-slate-500 mt-1">
                Expected format: JSON array of objects <code>{'{ hash, position }'}</code>.<br />
                Example:<br />
                <pre className="bg-slate-100 rounded p-2 overflow-x-auto">[
  {'{'}"hash": "...", "position": "right"{'}'},
  {'{'}"hash": "...", "position": "left"{'}'}
]</pre>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <Alert variant="success">
                <AlertTitle>Result</AlertTitle>
                <AlertDescription>{result}</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2 mt-4">
              <Button type="submit" disabled={loading}>
                Verify
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
