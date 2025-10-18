import { Card } from "@/components/ui/card"
import { ActivityChartResponse, CompletionChartResponse, OverviewResponse } from "@/data/manager"
import { Users, Target, CheckCircle, TrendingUp, Clock } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface OverviewWidgetsProps {
  data: OverviewResponse,
  completionChartData: CompletionChartResponse[],
  activityChartData: ActivityChartResponse[]
}

// const completionChartData = [
//   { week: "Week 1", rate: 65 },
//   { week: "Week 2", rate: 72 },
//   { week: "Week 3", rate: 78 },
//   { week: "Week 4", rate: 85 },
// ]

// const activityChartData = [
//   { day: "Mon", assigned: 12, submitted: 8 },
//   { day: "Tue", assigned: 15, submitted: 11 },
//   { day: "Wed", assigned: 18, submitted: 14 },
//   { day: "Thu", assigned: 14, submitted: 12 },
//   { day: "Fri", assigned: 20, submitted: 18 },
//   { day: "Sat", assigned: 8, submitted: 7 },
//   { day: "Sun", assigned: 5, submitted: 4 },
// ]

export function OverviewWidgets({ data, completionChartData, activityChartData }: OverviewWidgetsProps) {
  const parentChildRatio = data.totalParents > 0 ? ((data.totalChildren / data.totalParents) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-900">{data.totalParents + data.totalChildren}</p>
              <p className="text-xs text-blue-700 mt-2">
                {data.totalParents} parents • {data.totalChildren} children
              </p>
              <p className="text-xs text-blue-600 mt-1">Ratio: {parentChildRatio}%</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        {/* Total Missions */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Total Missions</p>
              <p className="text-3xl font-bold text-purple-900">{data.totalMissions}</p>
              <p className="text-xs text-purple-700 mt-2">
                {data.pendingMissions} pending • {data.completedMissions} completed
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </Card>

        {/* Total Submissions */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-green-900">{data.totalSubmissions}</p>
              <p className="text-xs text-green-700 mt-2">
                {data.approvedSubmissions} approved • {data.rejectedSubmissions} rejected
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        {/* Completion Rate */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-orange-900">{data.completionRate}%</p>
              <p className="text-xs text-orange-700 mt-2">Overall performance</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate Chart */}
        <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Completion Rate Trend</h3>
                <p className="text-sm text-gray-500 mb-3">Data from the last 4 weeks</p>
              </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Today's Activity */}
        <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
                <p className="text-sm text-gray-500 mb-3">Tasks assigned and submitted in the last 7 days</p>
              </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#3b82f6" name="Tasks Assigned" />
              <Bar dataKey="submitted" fill="#10b981" name="Tasks Submitted" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Today's Tasks Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{data.todayTasksAssigned}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Today's Tasks Submitted</p>
              <p className="text-2xl font-bold text-gray-900">{data.todayTasksSubmitted}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>
    </div>
  )
}
