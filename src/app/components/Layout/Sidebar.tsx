import { Home, PlusCircle, List, User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const { signOut } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/' },
    { name: 'Create Payment', icon: PlusCircle, href: '/create-payment' },
    { name: 'Manage Payments', icon: List, href: '/manage-payments' },
    { name: 'Profile', icon: User, href: '/profile' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ]

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <aside className="w-64 bg-gray-50 p-4 overflow-y-auto flex flex-col h-full">
      <nav className="space-y-2 flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-2 py-2 rounded-lg ${
              pathname === item.href
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <a
          href="#"
          className="flex items-center space-x-2 px-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  )
}