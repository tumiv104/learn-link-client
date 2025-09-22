'use client'

import { MissionManagementCard } from "@/components/dashboard/parent/MissionManagementCard"
import { Button } from "@/components/ui/button"
import { mockData } from "@/data/mockData"
import { Plus } from "lucide-react"

export default function MissionScreen() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Mission Management</h2>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Mission
            </Button>
            </div>

            <div className="grid gap-4">
            {mockData.parent_missions.map((mission) => (
                <MissionManagementCard key={mission.MissionId} mission={mission} />
            ))}
        </div>
      </div>
    )
}