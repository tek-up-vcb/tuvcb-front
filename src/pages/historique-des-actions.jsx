// src/pages/HistoriqueDesActions.jsx
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'

const HistoriqueDesActions = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Utilise le proxy /api du front (cohérent avec les autres pages)
        const res = await fetch(`/api/backlogs?limit=${pageSize}&offset=${(page - 1) * pageSize}`)
        const json = await res.json()
        setData(Array.isArray(json.items) ? json.items : [])
        setTotal(typeof json.total === 'number' ? json.total : 0)
      } catch (e) {
        console.error('Erreur de chargement des backlogs:', e)
        setData([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Historique des actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : data.length === 0 ? (
            <EmptyState
              title="Aucune action trouvée"
              description="Il n'y a pas encore d'historique."
            />
          ) : (
            <div className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Metadata</TableHead>
                    <TableHead>Créé le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>
                        {item.user_id != null ? (
                          item.user_id
                        ) : (
                          <Badge variant="secondary">anonyme</Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.action_type}</TableCell>
                      <TableCell className="max-w-xs truncate" title={item.action_description}>
                        {item.action_description}
                      </TableCell>
                      <TableCell>
                        {item.metadata ? (
                          <details>
                            <summary>Voir</summary>
                            <pre className="max-w-xs overflow-auto text-xs">
                              {JSON.stringify(item.metadata, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <Badge variant="secondary">—</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    Page {page} sur {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded border"
                    >
                      Précédent
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1 rounded border"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HistoriqueDesActions
