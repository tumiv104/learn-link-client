import { UserDetailsList } from "@/components/dashboard/manager/UserDetailsList";
import { UserOverviewResponse } from "@/data/manager";
import { getUsersOverview } from "@/services/manager/managerService";
import { useEffect, useState } from "react";

export default function UserDetailScreen() {
    const [userDetailData, setUserDetailData] = useState<UserOverviewResponse[]>([{
        userId: 1,
        name: "",
        email: "",
        role: "Parent",
        missionsAssigned: 0,
        missionsCompleted: 0,
        points: 0,
        createdAt: new Date().toISOString(),
    }]);

    const fetchUserDetailData = async () => {
        try {
            const res = await getUsersOverview();
            setUserDetailData(res.data)
        } catch {
        }
        }
    
        useEffect(() => {
        fetchUserDetailData();
        }, [])

    return <UserDetailsList users={userDetailData} />
}