'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface QuickActionsProps {
  setActiveSection: (section: string) => void
}

export default function QuickActions({ setActiveSection }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common payment actions</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button onClick={() => setActiveSection('create-payment')}>Create New Payment</Button>
        <Button onClick={() => setActiveSection('manage-payments')}>Manage Payments</Button>
        <Button onClick={() => setActiveSection('reports')}>View Reports</Button>
      </CardContent>
    </Card>
  )
}