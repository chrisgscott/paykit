'use client'

import { useState } from 'react'
import Header from '@/components/Layout/Header'
import Sidebar from '@/components/Layout/Sidebar'
import Dashboard from '@/components/Dashboard/Dashboard'
import CreatePayment from '@/components/CreatePayment/CreatePayment'
import ManagePayments from '@/components/ManagePayments/ManagePayments'
import Profile from '@/components/Profile/Profile'
import Settings from '@/components/Settings/Settings'
import { Client } from 'pg'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Dashboard />
      case 'create-payment':
        return <CreatePayment />
      case 'manage-payments':
        return <ManagePayments />
      case 'profile':
        return <Profile />
      case 'settings':
        return <Settings />
      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}