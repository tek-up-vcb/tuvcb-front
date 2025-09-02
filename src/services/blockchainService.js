const API_BASE_URL = '/api/blockchain/registry';

class BlockchainService {
  async deploy() {
    const r = await fetch(`${API_BASE_URL}/deploy`, { method: 'POST' });
    if (!r.ok) throw new Error('Deploy failed');
    return r.json();
  }

  async setAddress(address) {
    const r = await fetch(`${API_BASE_URL}/set-address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    if (!r.ok) throw new Error('Set address failed');
    return r.json();
  }

  async issue(batchId, diplome, hashes) {
    const r = await fetch(`${API_BASE_URL}/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId, diplome, hashes })
    });
    if (!r.ok) throw new Error('Issue failed');
    return r.json();
  }

  async events(batchId) {
    const r = await fetch(`${API_BASE_URL}/events/${batchId}`);
    if (!r.ok) throw new Error('Events fetch failed');
    return r.json();
  }

  async address() {
    const r = await fetch(`${API_BASE_URL}/address`);
    if (!r.ok) throw new Error('Address fetch failed');
    return r.json();
  }

  async verify(address) {
    const r = await fetch(`${API_BASE_URL}/verify?address=${encodeURIComponent(address)}`);
    if (!r.ok) throw new Error('Verify failed');
    return r.json();
  }

  async info() {
    const r = await fetch(`${API_BASE_URL}/info`);
    if (!r.ok) throw new Error('Info fetch failed');
    return r.json();
  }

  async allEvents() {
  // On-chain events sont servis par le microservice blockchain sous /api/blockchain/diplomas/events
  const r = await fetch(`/api/blockchain/diplomas/events`);
    if (!r.ok) throw new Error('All events fetch failed');
    return r.json();
  }

  async testIssue() {
    // Utilise un batchId et diplome de test + un hash fixe
    const payload = { batchId: 'TEST-BATCH', diplome: 'TestDiploma', hashes: ['0x' + '0'.repeat(64)] };
    const r = await fetch(`${API_BASE_URL}/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error('Test issue failed');
    return r.json();
  }
}

export default new BlockchainService();