import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {/* Main content will go here */}
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </main>
      </div>
    </div>
  )
}