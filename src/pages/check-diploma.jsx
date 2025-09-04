
import { useState } from 'react';
import { ShieldCheck, RefreshCcw, Hash, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Nouvelle page de vérification simplifiée (plus de Merkle root / proof)
// Deux modes: par hash direct OU en collant le JSON complet du diplôme (tel qu'émis en review)
// Appelle backend: POST /api/blockchain/registry/verify-diploma

export default function CheckDiplomaPage() {
  const [mode, setMode] = useState('hash'); // 'hash' | 'json'
  const [hash, setHash] = useState('');
  const [json, setJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const resetAll = () => {
    setHash(''); setJson(''); setError(null); setResult(null);
  };

  async function handleVerify(e) {
    e.preventDefault();
    setError(null); setResult(null); setLoading(true);
    let body;
    if (mode === 'hash') {
      if (!hash.trim()) { setError('Hash requis'); setLoading(false); return; }
      body = { hash: hash.trim() };
    } else {
      if (!json.trim()) { setError('JSON requis'); setLoading(false); return; }
      try {
        body = { diploma: JSON.parse(json) };
      } catch {
        setError('JSON invalide'); setLoading(false); return;
      }
    }
    try {
      const r = await fetch('/api/blockchain/registry/verify-diploma', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
      });
      if(!r.ok) throw new Error('Erreur HTTP '+r.status);
      const data = await r.json();
      setResult(data);
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <h1 className="text-xl font-semibold tracking-tight">Vérifier un diplôme</h1>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">Entrez soit directement le hash on-chain du diplôme, soit collez l'objet JSON complet du diplôme pour calculer son empreinte et vérifier sa présence dans les events blockchain.</p>

        <div className="flex gap-2 text-sm font-medium">
          <button type="button" onClick={() => { setMode('hash'); resetAll(); }} className={`flex-1 rounded-md border px-3 py-2 flex items-center justify-center gap-1 transition ${mode==='hash' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'}`}> <Hash className="w-4 h-4"/> Par hash</button>
          <button type="button" onClick={() => { setMode('json'); resetAll(); }} className={`flex-1 rounded-md border px-3 py-2 flex items-center justify-center gap-1 transition ${mode==='json' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'}`}> <FileText className="w-4 h-4"/> Par JSON</button>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          {mode === 'hash' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Hash du diplôme (0x...)</label>
              <Input value={hash} onChange={e=>setHash(e.target.value)} placeholder="0x..." spellCheck={false} autoComplete="off" />
            </div>
          )}
          {mode === 'json' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Objet JSON du diplôme</label>
              <Textarea value={json} onChange={e=>setJson(e.target.value)} rows={8} spellCheck={false} className="font-mono text-xs" placeholder='{"studentId":"...","diploma":{...}}' />
              <p className="text-[11px] text-slate-500">Le hash calculé sera keccak256(JSON.stringify(objet)) côté serveur.</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Vérification...' : 'Vérifier'}</Button>
            <Button type="button" variant="outline" onClick={resetAll} className="flex items-center gap-1"><RefreshCcw className="w-4 h-4"/> Reset</Button>
          </div>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && !error && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm space-y-2">
            <div className="flex items-center gap-2">
              {result.found ? <span className="text-emerald-600 font-semibold">Diplôme trouvé ✅</span> : <span className="text-rose-600 font-semibold">Diplôme non trouvé ❌</span>}
            </div>
            <div><span className="font-medium text-slate-600">Hash:</span> <code className="break-all text-slate-800">{result.hash}</code></div>
            <div><span className="font-medium text-slate-600">Occurrences:</span> {result.occurrences}</div>
            {result.firstEvent && (
              <details className="mt-2">
                <summary className="cursor-pointer text-slate-600 hover:text-slate-800">Voir premier event</summary>
                <pre className="mt-2 text-xs bg-white border rounded p-2 max-h-60 overflow-auto">{JSON.stringify(result.firstEvent, null, 2)}</pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
