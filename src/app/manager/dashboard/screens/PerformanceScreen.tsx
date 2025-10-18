import { TaskPerformanceList } from "@/components/dashboard/manager/TaskPerformanceList"
import { ChildPerformanceResponse, ParentPerformanceResponse } from "@/data/manager";
import { getChildOverview, getParentOverview } from "@/services/manager/managerService";
import { useEffect, useState } from "react";

export default function PerformanceScreen() {
    const [parentPerformance, setParentPerformance] = useState<ParentPerformanceResponse[]>([{
        parentId: 0, 
        parentName: "", 
        assignedMissions: 0, 
        completedMissions: 0, 
        completionRate: 0
    }]);

    const [childPerformance, setChildPerformance] = useState<ChildPerformanceResponse[]>([{
        childId: 1,
        childName: "",
        assignedMissions: 0,
        completedMissions: 0,
        validSubmissions: 0,
        rejectedSubmissions: 0,
        completionRate: 0,
    }]);
        
    const fetchParentPerformanceData = async () => {
        try {
            const res = await getParentOverview();
            setParentPerformance(res.data)
        } catch {
        }
    }

    const fetchChildPerformanceData = async () => {
        try {
            const res = await getChildOverview();
            setChildPerformance(res.data)
        } catch {
        }
    }
    
    useEffect(() => {
        fetchParentPerformanceData();
        fetchChildPerformanceData();
    }, [])
    return <TaskPerformanceList parentPerformance={parentPerformance} childPerformance={childPerformance} />
}