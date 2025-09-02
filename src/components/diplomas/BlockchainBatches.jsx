import { useEffect, useState } from 'react';
import BlockchainService from '@/services/blockchainService';
import DiplomasService from '@/services/diplomasService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { computeDiplomaHashes } from '@/utils/diplomaHash';
import { ethers } from 'ethers';

// Construit un JSON minimal pour chaque étudiant (hypothèse: studentIds -> on récupèrera plus tard détails si service étudiants expose API individuelle)
function buildDiplomaJson(studentId, diploma) {
  return JSON.stringify({ studentId, diplomaId: diploma.id, name: diploma.name }, null, 2);
}

export default function BlockchainBatches() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anchorInProgress, setAnchorInProgress] = useState({});
  const [detailsOpen, setDetailsOpen] = useState({}); // batch request id -> bool
  const [eventsMap, setEventsMap] = useState({}); // batchId -> events
  const [hashCache, setHashCache] = useState({}); // requestId -> hashes

  const load = async () => {
    setLoading(true);
    try {
      const data = await DiplomasService.getAllDiplomaRequests();
      setRequests(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const startAnchor = async (r) => {
    const batchId = r.id.slice(0,8); // simple batch id stable
    const diplomeLabel = r.diploma?.name || 'Diplome';
    try {
      setAnchorInProgress(p => ({...p, [r.id]: true}));
      // 1) signature utilisateur (message simple)
      if (!window.ethereum) throw new Error('Wallet non détecté');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const message = `Anchor diploma batch ${batchId} for request ${r.id}`;
      const sig = await signer.signMessage(message);
      // Vérification locale
      const recovered = ethers.verifyMessage(message, sig);
      if (recovered.toLowerCase() !== address.toLowerCase()) throw new Error('Signature invalide');
      // 2) verrou DB
      await fetch(`/api/diplomas/requests/${r.id}/anchor-request`, {
        method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
        body: JSON.stringify({ batchId, diplomeLabel, signer: address, signature: sig })
      });
      // 3) compute hashes réels
      const hashes = computeDiplomaHashes(r.studentIds, { id: r.diplomaId, name: diplomeLabel });
      const issueRes = await BlockchainService.issue(batchId, diplomeLabel, hashes);
      // 3) confirmer ancrage
      await fetch(`/api/diplomas/requests/${r.id}/anchor-confirm`, {
        method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ txHash: issueRes.txHash })
      });
      await load();
      // charger events on-chain pour ce batch
      await fetchEvents(batchId);
    } catch (e) { alert('Erreur ancrage: '+ e.message); }
    setAnchorInProgress(p => ({...p, [r.id]: false}));
  };

  const toggleDetails = async (r) => {
    setDetailsOpen(d => ({...d, [r.id]: !d[r.id]}));
    // Pré-charge calculs si ouverture
    if (!detailsOpen[r.id]) {
      const batchId = r.id.slice(0,8);
      if (!eventsMap[batchId]) await fetchEvents(batchId);
      if (!hashCache[r.id]) {
        const hashes = computeDiplomaHashes(r.studentIds, { id: r.diplomaId, name: r.diploma?.name || 'Diplome' });
        setHashCache(h => ({...h, [r.id]: hashes}));
      }
    }
  };

  const fetchEvents = async (batchId) => {
    try {
      const evs = await BlockchainService.events(batchId);
      if (evs && evs.error) {
        console.warn('Events error for batch', batchId, evs.message);
        setEventsMap(m => ({...m, [batchId]: []}));
      } else {
        setEventsMap(m => ({...m, [batchId]: evs}));
      }
    } catch (e) { console.warn('fetchEvents failed', batchId, e); }
  };

  return <div className="space-y-4">
    <h2 className="text-xl font-semibold">Blockchain Batches</h2>
    {loading && <p>Chargement...</p>}
    {error && <p className="text-red-500">{error}</p>}
    <div className="grid gap-4 md:grid-cols-2">
      {requests.map(r => <Card key={r.id} className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <div className="font-mono text-xs">{r.id}</div>
          <span className="text-sm px-2 py-1 rounded bg-muted">{r.status}</span>
        </div>
        <div className="text-sm">Diplôme: {r.diploma?.name}</div>
        <div className="text-xs text-muted-foreground">Etudiants: {r.studentIds.length}</div>
        {r.anchorTxHash && <div className="text-xs break-all">Tx: {r.anchorTxHash}</div>}
        <div className="flex flex-wrap gap-2">
          {r.status === 'ready_for_anchor' && !r.anchorTxHash && <Button disabled={anchorInProgress[r.id]} onClick={() => startAnchor(r)}>
            {anchorInProgress[r.id] ? 'Ancrage...' : 'Ancrer'}
          </Button>}
          <Button variant="outline" onClick={() => toggleDetails(r)}>
            {detailsOpen[r.id] ? 'Masquer détails' : 'Détails'}
          </Button>
        </div>
        {detailsOpen[r.id] && (
          <div className="mt-2 space-y-3 border-t pt-2">
            <div className="text-xs font-semibold">Batch ID: {r.id.slice(0,8)}</div>
            {hashCache[r.id] && <div>
              <p className="text-xs mb-1 font-medium">Hashes ({hashCache[r.id].length}):</p>
              <div className="max-h-32 overflow-auto border rounded p-2 text-[10px] leading-snug font-mono bg-muted/30">
                {hashCache[r.id].map(h => <div key={h}>{h}</div>)}
              </div>
            </div>}
            {hashCache[r.id] && <div>
              <p className="text-xs mb-1 font-medium">JSON exemples:</p>
              <div className="max-h-32 overflow-auto border rounded p-2 text-[10px] leading-snug font-mono bg-muted/30">
                {r.studentIds.slice(0,3).map(sid => <pre key={sid}>{buildDiplomaJson(sid, { id: r.diplomaId, name: r.diploma?.name })}</pre>)}
                {r.studentIds.length > 3 && <div>... (+{r.studentIds.length - 3} autres)</div>}
              </div>
            </div>}
            <div>
              <p className="text-xs mb-1 font-medium">Events on-chain:</p>
              <div className="max-h-40 overflow-auto border rounded p-2 text-[10px] font-mono bg-muted/30">
                {(eventsMap[r.id.slice(0,8)] || []).map(ev => <div key={ev.txHash + ev.diplomaHash}>{ev.blockNumber}:{ev.diplomaHash?.slice(0,18)}...</div>)}
                {!eventsMap[r.id.slice(0,8)] && <div className="italic">Chargement...</div>}
                {eventsMap[r.id.slice(0,8)] && eventsMap[r.id.slice(0,8)].length === 0 && <div>Aucun event</div>}
              </div>
            </div>
          </div>
        )}
      </Card>)}
    </div>
  </div>;
}