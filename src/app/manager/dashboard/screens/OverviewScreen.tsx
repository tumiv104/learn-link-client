import { OverviewWidgets } from "@/components/dashboard/manager/OverviewWidgets";
import { ActivityChartResponse, CompletionChartResponse, OverviewResponse } from "@/data/manager";
import { getCompletionTrend, getOverview, getWeeklyActivity } from "@/services/manager/managerService";
import { useEffect, useState } from "react";

export default function OverviewScreen() {
    const [overviewData, setOverviewData] = useState<OverviewResponse>({
        totalParents: 0,
        totalChildren: 0,
        totalMissions: 0,
        pendingMissions: 0,
        completedMissions: 0,
        totalSubmissions: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
        rejectedSubmissions: 0,
        completionRate: 0,
        todayTasksAssigned: 0,
        todayTasksSubmitted: 0,
    });

    const [completionChartData, setCompletionChartData] = useState<CompletionChartResponse[]>([{
        week: "", 
        rate: 0
    }]);

    const [activityChartData, setActivityChartData] = useState<ActivityChartResponse[]>([{
        day: "", 
        assigned: 0, 
        submitted: 0
    }]);

    const fetchOverviewData = async () => {
    try {
            const res = await getOverview();
            setOverviewData(res.data)
        } catch {
        }
    }

    const fetchCompletionChartData = async () => {
    try {
            const res = await getCompletionTrend();
            setCompletionChartData(res.data)
        } catch {
        }
    }

    const fetchActivityChartData = async () => {
    try {
            const res = await getWeeklyActivity();
            setActivityChartData(res.data)
        } catch {
        }
    }

    useEffect(() => {
        fetchOverviewData();
        fetchCompletionChartData();
        fetchActivityChartData();
    }, [])

  return <OverviewWidgets data={overviewData} completionChartData={completionChartData} activityChartData={activityChartData}/>;
}
