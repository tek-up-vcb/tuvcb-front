import { Button } from '@/components/ui/button'
import { PanelLeftOpen } from 'lucide-react'

export default function FloatingSidebarToggle({ onClick, isVisible }) {
  if (!isVisible) return null

  return (
    <Button
      variant="default"
      size="sm"
      className="fixed top-4 left-4 z-50 h-10 w-10 p-0 shadow-lg hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <PanelLeftOpen className="h-4 w-4" />
      <span className="sr-only">Open sidebar</span>
    </Button>
  )
}
