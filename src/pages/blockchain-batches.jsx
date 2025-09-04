import BlockchainBatches from '@/components/diplomas/BlockchainBatches';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function BlockchainBatchesPage() {
  return (
    <ProtectedRoute requiredRoles={['Admin','Teacher']}>
      <div className="space-y-6 p-4">
        <BlockchainBatches />
      </div>
    </ProtectedRoute>
  );
}