import { NotificationItem } from "@/components/dashboard/NotificationItem"
import { StatCard } from "@/components/dashboard/StatCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockData } from "@/data/mockData"
import { Bell, Users } from "lucide-react"

export default function OverviewScreen() {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Missions"
            value={mockData.overview.totalMissions}
            description="This month"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Completed"
            value={mockData.overview.completedMissions}
            description="Missions finished"
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Pending Reviews"
            value={mockData.overview.pendingSubmissions}
            description="Need attention"
            gradient="bg-gradient-to-br from-amber-500 to-amber-600"
          />
          <StatCard
            title="Redemptions"
            value={mockData.overview.pendingRedemptions}
            description="Pending approval"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Children Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.children.map((child) => (
                  <div key={child.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{child.AvatarUrl}</div>
                      <div>
                        <h4 className="font-semibold">{child.Name}</h4>
                        <p className="text-sm text-gray-600">{child.totalPoints} total points</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.NotificationId}
                    message={notification.Message}
                    time={notification.CreatedAt}
                    type={notification.Type}
                    isRead={notification.IsRead}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
}