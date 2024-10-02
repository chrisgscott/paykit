import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'

interface ActivityItem {
  action: string
  amount: number
  name: string
  time: string
}

const recentActivities: ActivityItem[] = [
  { action: 'Received', amount: 200, name: 'John Doe', time: '2 hours ago' },
  { action: 'Scheduled', amount: 150, name: 'Jane Smith', time: '5 hours ago' },
  { action: 'Failed', amount: 75, name: 'Bob Johnson', time: '1 day ago' },
]

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest payment activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${activity.action === 'Failed' ? 'bg-red-500' : 'bg-green-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action} ${activity.amount} from {activity.name}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}