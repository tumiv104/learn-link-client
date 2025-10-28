"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, TrendingUp, Target, CheckCircle, Clock, Loader2, Award } from "lucide-react"
import { useTranslations } from "next-intl"
import { getChildren } from "@/services/parent/parentService"
import { getChildProgressReport } from "@/services/report/reportService"
import type { ChildBasicInfoDTO } from "@/data/ChildBasicInfoDTO"
import type { ChildProgressReportDTO } from "@/data/childProgressReport"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Cell, Pie, PieChart } from "recharts"
import { UserDto } from "@/services/auth/authService"

interface ReportScreenProps {
  user: UserDto
}

export default function ReportScreen({ user } : ReportScreenProps) {
  const t = useTranslations("parentDashboard.reports")

  const [children, setChildren] = useState<ChildBasicInfoDTO[]>([])
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null)
  const [period, setPeriod] = useState<"all" | "day" | "week" | "month" | "year">("month")
  const [report, setReport] = useState<ChildProgressReportDTO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await getChildren(user.id)
        setChildren(data)
        if (data.length > 0) setSelectedChildId(Number(data[0].childId))
      } catch (err) {
        console.error("Error fetching children:", err)
      }
    }
    fetchChildren()
  }, [])

  // Fetch report
  useEffect(() => {
    if (!selectedChildId) return
    const fetchReport = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getChildProgressReport(selectedChildId, period)
        setReport(data)
      } catch (err: any) {
        setError(err.message || t("errorLoading"))
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [selectedChildId, period])

  const missionStatusData = report
    ? [
        { name: t("missionStatusLabels.Completed"), value: report.completedMissions, fill: "hsl(142, 76%, 36%)" },
        { name: t("missionStatusLabels.Submitted"), value: report.submittedMissions, fill: "hsl(217, 91%, 60%)" },
        { name: t("missionStatusLabels.Processing"), value: report.processingMissions, fill: "hsl(38, 92%, 50%)" },
        { name: t("missionStatusLabels.Assigned"), value: report.assignedMissions, fill: "hsl(215, 16%, 47%)" },
      ]
    : []

  const barChartData = report
    ? [
        { status: t("missionStatusLabels.Assigned"), count: report.assignedMissions, fill: "hsl(215, 16%, 47%)" },
        { status: t("missionStatusLabels.Processing"), count: report.processingMissions, fill: "hsl(38, 92%, 50%)" },
        { status: t("missionStatusLabels.Submitted"), count: report.submittedMissions, fill: "hsl(217, 91%, 60%)" },
        { status: t("missionStatusLabels.Completed"), count: report.completedMissions, fill: "hsl(142, 76%, 36%)" },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
            <p className="text-gray-600">{t("desc")}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Select
            value={selectedChildId?.toString() || ""}
            onValueChange={(value) => setSelectedChildId(Number(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t("selectChildPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.childId} value={child.childId.toString()}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t("periodLabels.day")}</SelectItem>
              <SelectItem value="week">{t("periodLabels.week")}</SelectItem>
              <SelectItem value="month">{t("periodLabels.month")}</SelectItem>
              <SelectItem value="year">{t("periodLabels.year")}</SelectItem>
              <SelectItem value="all">{t("periodLabels.all")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      )}

      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {!loading && !error && report && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{t("stats.totalMissions")}</p>
                    <p className="text-3xl font-bold mt-1">{report.totalMissions}</p>
                  </div>
                  <Target className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{t("stats.completedMissions")}</p>
                    <p className="text-3xl font-bold mt-1">{report.completedMissions}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{t("stats.processingMissions")}</p>
                    <p className="text-3xl font-bold mt-1">{report.processingMissions + report.submittedMissions}</p>
                  </div>
                  <Clock className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{t("stats.totalPointsEarned")}</p>
                    <p className="text-3xl font-bold mt-1">{report.totalPointsEarned}</p>
                  </div>
                  <Award className="w-10 h-10 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <CardTitle>{t("charts.missionStatus")}</CardTitle>
                </CardTitle>
                <CardDescription>{t("charts.completionTrend")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[300px]">
                  <BarChart data={barChartData}>
                    <XAxis dataKey="status" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  {t("charts.completionTrend")}
                </CardTitle>
                <CardDescription>{t("charts.missionStatus")}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-6">
                <ChartContainer className="h-[300px] w-[300px]">
                  <PieChart>
                    <Pie data={missionStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
                      {missionStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>

                <div className="flex flex-col justify-center gap-2">
                  {missionStatusData.map((entry) => {
                    const percent = report && report.totalMissions > 0
                      ? ((entry.value / report.totalMissions) * 100).toFixed(0)
                      : "0"

                    return (
                      <div key={entry.name} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                        <span className="text-sm text-gray-700">
                          {entry.name}: {percent}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("summary.title")}</CardTitle>
              <CardDescription>
                {t("summary.reportFor", {
                  child: report.childName,
                  period:
                   period === "all"
                ? t("periodLabels.all")
                : period === "day"
                    ? t("periodLabels.day")
                    : period === "week"
                    ? t("periodLabels.week")
                    : period === "month"
                        ? t("periodLabels.month")
                        : t("periodLabels.year")

                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700 font-medium">{t("summary.completionRate")}</p>
                  <p className="text-2xl font-bold text-green-800 mt-1">
                    {report.totalMissions > 0 ? Math.round((report.completedMissions / report.totalMissions) * 100) : 0}%
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">{t("summary.avgPoints")}</p>
                  <p className="text-2xl font-bold text-blue-800 mt-1">
                    {report.completedMissions > 0 ? Math.round(report.totalPointsEarned / report.completedMissions) : 0}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium">{t("summary.lastSubmission")}</p>
                  <p className="text-lg font-bold text-purple-800 mt-1">
                    {report.lastSubmissionAt
                      ? new Date(report.lastSubmissionAt).toLocaleDateString()
                      : t("summary.noSubmissionsYet")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!loading && !error && !report && children.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">{t("noChildren.title")}</h3>
            <p className="text-gray-500">{t("noChildren.desc")}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
