import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import BlockchainService from '@/services/blockchainService';
import AuthService from '@/lib/authService';
import { useNavigate } from 'react-router-dom';

export default function ManageContract() {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [verifAddr, setVerifAddr] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [setting, setSetting] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [events, setEvents] = useState([]);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState(null); // {type,message}
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    refreshAddress();
    loadInfo();
    loadEvents();
  }, [navigate]);

  async function refreshAddress() {
    try {
      const { address } = await BlockchainService.address();
      setCurrentAddress(address || null);
    } catch {
      // ignore fetch errors
    }
  }

  async function loadInfo() {
    try { const data = await BlockchainService.info(); setInfo(data); } catch { /* ignore */ }
  }

  async function loadEvents() {
    try { const data = await BlockchainService.allEvents(); setEvents(data.slice(-20).reverse()); } catch { /* ignore */ }
  }

  async function handleDeploy() {
    setDeploying(true); setError(null);
    try {
      const { address } = await BlockchainService.deploy();
      setCurrentAddress(address);
      setToast({ type: 'success', message: 'Contrat déployé: ' + address });
      loadInfo();
    } catch (e) { setError(e.message); }
    finally { setDeploying(false); }
  }

  async function handleVerify() {
    setLoading(true); setError(null);
    try {
      const res = await BlockchainService.verify(verifAddr);
      setVerifyResult(res);
      setToast({ type: res.canUse ? 'success' : 'warning', message: res.canUse ? 'Adresse compatible' : 'Adresse invalide ou incompatible' });
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleSet() {
    if (!verifyResult?.canUse) return;
    setSetting(true); setError(null);
    try {
      await BlockchainService.setAddress(verifyResult.address);
      setCurrentAddress(verifyResult.address);
      setToast({ type: 'success', message: 'Adresse définie' });
      loadInfo();
    } catch (e) { setError(e.message); }
    finally { setSetting(false); }
  }

  async function handleTestIssue() {
    setTesting(true); setError(null);
    try {
      const r = await BlockchainService.testIssue();
      setToast({ type: 'success', message: 'Tx test envoyée: ' + r.txHash });
      await loadEvents();
    } catch (e) { setError(e.message); setToast({ type: 'error', message: e.message }); }
    finally { setTesting(false); }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Smart Contract Management</h1>
        <p className="text-muted-foreground mt-2">Déployer un nouveau contrat ou se brancher sur un existant.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Contrat Actif</CardTitle>
          <CardDescription>Adresse actuellement utilisée par le backend Blockchain Service.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm bg-muted px-3 py-1 rounded">
              {currentAddress || 'Aucun défini'}
            </span>
            {currentAddress && <Badge variant="secondary">Actif</Badge>}
            <Button variant="outline" size="sm" onClick={refreshAddress}>Rafraîchir</Button>
          </div>
          {info && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Réseau</p>
                <p className="font-medium">{info.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Chain ID</p>
                <p className="font-medium">{info.chainId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">RPC</p>
                <p className="font-medium truncate max-w-[180px]" title={info.rpc}>{info.rpc}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contrat</p>
                <p className="font-medium break-all">{info.contractAddress || '-'}</p>
              </div>
            </div>
          )}
          <div>
            <Button onClick={handleDeploy} disabled={deploying} className="border-0 shadow-sm">
              {deploying ? 'Déploiement...' : 'Déployer nouveau contrat'}
            </Button>
            <Button onClick={handleTestIssue} disabled={testing || !currentAddress} variant="outline" className="ml-2 border-0 shadow-sm">
              {testing ? 'Test en cours...' : 'Envoyer test event'}
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Se greffer sur un contrat existant</CardTitle>
          <CardDescription>Vérifie la présence du bytecode et la fonction issueDiplomas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap items-center">
            <Input placeholder="0x..." value={verifAddr} onChange={e => setVerifAddr(e.target.value)} className="w-96 max-w-full" />
            <Button onClick={handleVerify} disabled={loading || !verifAddr} variant="outline" className="border-0 shadow-sm">{loading ? 'Vérification...' : 'Vérifier'}</Button>
          </div>
          {verifyResult && (
            <div className="text-sm space-y-2">
              <p>Adresse normalisée: <span className="font-mono">{verifyResult.address}</span></p>
              <p>Code présent: {verifyResult.isContract ? 'Oui' : 'Non'}</p>
              <p>Interface attendue: {verifyResult.matchesInterface ? 'OK' : 'Manquante'}</p>
              <p>Taille du code: {verifyResult.codeSize} bytes</p>
              {verifyResult.error && <p className="text-red-600">Erreur: {verifyResult.error}</p>}
              <div>
                <Button onClick={handleSet} disabled={!verifyResult.canUse || setting} className="border-0 shadow-sm">
                  {setting ? 'Application...' : 'Définir comme contrat actif'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Derniers Events (max 20)</CardTitle>
          <CardDescription>Events DiplomaIssued les plus récents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 pr-4">Block</th>
                  <th className="py-1 pr-4">Batch</th>
                  <th className="py-1 pr-4">Diplôme</th>
                  <th className="py-1 pr-4">Hash</th>
                  <th className="py-1 pr-4">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.txHash + ev.diplomaHash} className="border-b last:border-b-0">
                    <td className="py-1 pr-4 font-mono">{ev.blockNumber}</td>
                    <td className="py-1 pr-4">{ev.batchId}</td>
                    <td className="py-1 pr-4">{ev.diplome}</td>
                    <td className="py-1 pr-4 font-mono truncate max-w-[140px]" title={ev.diplomaHash}>{ev.diplomaHash}</td>
                    <td className="py-1 pr-4">{ev.timestamp ? new Date(ev.timestamp * 1000).toLocaleString() : '-'}</td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-muted-foreground">Aucun event</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded shadow-lg text-sm font-medium backdrop-blur border ${toast.type === 'success' ? 'bg-green-600/90 text-white border-green-500' : toast.type === 'warning' ? 'bg-yellow-600/90 text-white border-yellow-500' : 'bg-red-600/90 text-white border-red-500'}`}
             onAnimationEnd={() => { /* placeholder */ }}>
          <div className="flex items-center gap-3">
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-white/80 hover:text-white">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
