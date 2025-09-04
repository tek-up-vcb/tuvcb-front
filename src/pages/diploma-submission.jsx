import BlockchainBatches from '@/components/diplomas/BlockchainBatches'
import ProtectedRoute from '@/components/ProtectedRoute'

// Page for official diploma submission to the blockchain
export default function DiplomaSubmissionPage() {
  return (
    <ProtectedRoute requiredRoles={['Admin','Teacher']}>
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-3xl font-bold">Diploma Submission</h1>
          <p className="text-muted-foreground">Submit, review and anchor diploma batches on-chain</p>
        </div>
        {/* Reuse existing batches component */}
        <BlockchainBatches />
      </div>
    </ProtectedRoute>
  )
}
