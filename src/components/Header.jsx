import { Link } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'

function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        TEK-UP University
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/" className="px-3 py-2 text-sm font-medium">
                Home
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
            <NavigationMenuContent className="p-4">
              <ul className="grid w-40 gap-2">
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#" className="block rounded-md p-2 hover:bg-accent">
                      Students
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#" className="block rounded-md p-2 hover:bg-accent">
                      Teachers
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="#" className="px-3 py-2 text-sm font-medium">
                Docs
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/about" className="px-3 py-2 text-sm font-medium">
                About
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

export default Header
