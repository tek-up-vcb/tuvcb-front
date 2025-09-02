import BlockchainBatches from '@/components/diplomas/BlockchainBatches';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function BlockchainBatchesPage() {
  return (
    <ProtectedRoute requiredRoles={['Admin','Teacher']}>
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-3xl font-bold">Blockchain Batches</h1>
          <p className="text-muted-foreground">Suivi et ancrage des lots de diplômes</p>
        </div>
        <BlockchainBatches />
      </div>
    </ProtectedRoute>
  );
}