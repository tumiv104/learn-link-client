'use client'

import { MissionCard } from "@/components/dashboard/child/MissionCard";
import { mockData } from "@/data/mockData";

export default function MissionScreen() {
  return (
    <div className="space-y-6 pb-24">
          <div className="text-center mb-6">
            <div className="text-6xl animate-bounce mb-2">⚔️</div>
            <h2 className="text-3xl font-bold text-gray-800">Mission Control</h2>
            <p className="text-gray-600">Choose your next adventure!</p>
          </div>
    
          <div className="grid gap-4">
            {mockData.missions.map((mission) => (
              <MissionCard key={mission.id} {...mission} />
            ))}
          </div>
        </div>
  )
}