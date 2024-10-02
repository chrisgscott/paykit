import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function Settings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Settings</CardTitle>
        <CardDescription>Manage your app preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch id="notifications" />
          <Label htmlFor="notifications">Enable email notifications</Label>
        </div>
      </CardContent>
    </Card>
  )
}