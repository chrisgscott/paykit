import { Home, PlusCircle, List, User, Settings } from 'lucide-react'

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const navItems = [
    { name: 'Dashboard', icon: Home, section: 'home' },
    { name: 'Create Payment', icon: PlusCircle, section: 'create-payment' },
    { name: 'Manage Payments', icon: List, section: 'manage-payments' },
    { name: 'Profile', icon: User, section: 'profile' },
    { name: 'Settings', icon: Settings, section: 'settings' },
  ]

  return (
    <aside className="w-64 bg-gray-50 p-4 overflow-y-auto">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <a
            key={item.section}
            href="#"
            className={`flex items-center space-x-2 px-2 py-2 rounded-lg ${
              activeSection === item.section
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => setActiveSection(item.section)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  )
}