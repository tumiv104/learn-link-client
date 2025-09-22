'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function ProfileScreen() {
    return (
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Profile & Account Management
                </CardTitle>
                <CardDescription>Manage your account and children's profiles</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Profile settings</h3>
                <p className="text-gray-500">Account management features will be available here</p>
                </div>
            </CardContent>
            </Card>
      </div>
    )
}