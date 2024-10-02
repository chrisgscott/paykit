import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface QuickActionsProps {
  setActiveSection: (section: string) => void
}

export default function QuickActions({ setActiveSection }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Create new payments quickly</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <Button onClick={() => setActiveSection('create-payment')}>Create One-Off Payment</Button>
        <Button onClick={() => setActiveSection('create-payment')}>Create Payment Plan</Button>
        <Button onClick={() => setActiveSection('create-payment')}>Create Recurring Payment</Button>
      </CardContent>
    </Card>
  )
}