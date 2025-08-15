import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 w-8 p-0">
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function ThemeToggleMenuItem() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <DropdownMenuItem onClick={toggleTheme}>
      <div className="flex items-center gap-2">
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </div>
    </DropdownMenuItem>
  )
}
