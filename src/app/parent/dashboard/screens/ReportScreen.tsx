'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp } from "lucide-react"

export default function ReportScreen() {
    return (
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Learning Reports
                </CardTitle>
                <CardDescription>Track your children's progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Reports coming soon</h3>
                <p className="text-gray-500">Detailed analytics and progress reports will be available here</p>
                </div>
            </CardContent>
            </Card>
      </div>
    )
}