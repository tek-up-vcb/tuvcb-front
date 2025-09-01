import { Link } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import logo from '@/assets/logo.png'

function Header() {
  return (
    <header className="py-4">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="TEK-UP University"
            className="h-12 w-auto"
          />
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
                      <Link to="/login" className="block rounded-md p-2 hover:bg-accent border-0">
                        Students
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/login" className="block rounded-md p-2 hover:bg-accent border-0">
                        Teachers
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/check-diploma" className="px-3 py-2 text-sm font-medium">
                  Verify Diploma
                </Link>
              </NavigationMenuLink>
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
      </div>
    </header>
  )
}

export default Header


