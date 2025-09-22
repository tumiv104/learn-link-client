'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockData } from "@/data/mockData"
import { AlertCircle, Plus, Star } from "lucide-react"

export default function RewardScreen() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Reward Management</h2>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Reward
            </Button>
            </div>

            {/* Pending Redemptions */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Pending Redemptions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                {mockData.redemptions
                    .filter((r) => r.Status === "Pending")
                    .map((redemption) => (
                    <div
                        key={redemption.RedemptionId}
                        className="flex items-center justify-between p-4 bg-amber-50 rounded-lg"
                    >
                        <div>
                        <h4 className="font-semibold">{redemption.RewardName}</h4>
                        <p className="text-sm text-gray-600">
                            Requested by {redemption.ChildName} • {redemption.Cost} points
                        </p>
                        <p className="text-xs text-gray-500">
                            {new Date(redemption.RequestedAt).toLocaleDateString()}
                        </p>
                        </div>
                        <div className="flex gap-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            Approve
                        </Button>
                        <Button variant="outline" size="sm">
                            Reject
                        </Button>
                        </div>
                    </div>
                    ))}
                </div>
            </CardContent>
            </Card>

            {/* Available Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockData.rewards.map((reward) => (
                <Card key={reward.RewardId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{reward.Name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{reward.Description}</p>
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="font-medium text-amber-600">{reward.Cost} points</span>
                    </div>
                    <Badge variant="outline">{reward.Stock} left</Badge>
                    </div>
                    <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Delete
                    </Button>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>
      </div>
    )
}