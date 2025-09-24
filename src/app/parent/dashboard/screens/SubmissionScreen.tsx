'use client'

import { SubmissionReviewCard } from "@/components/dashboard/parent/SubmissionReviewCard"
import { Badge } from "@/components/ui/badge"
import { mockData } from "@/data/mockData"
import { useTranslations } from "next-intl"

export default function SubmissionScreen() {
  const t = useTranslations("parentDashboard.submissions")
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
            <Badge variant="secondary" className="text-sm">
                {t("pending", { count: mockData.submissions.filter((s) => s.Status === "Pending Review").length })}
            </Badge>
            </div>

            <div className="grid gap-4">
            {mockData.submissions.map((submission) => (
                <SubmissionReviewCard key={submission.SubmissionId} submission={submission} />
            ))}
        </div>
      </div>
    )
}