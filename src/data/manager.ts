export interface OverviewResponse {
    totalParents: number,
    totalChildren: number,
    totalMissions: number,
    pendingMissions: number,
    completedMissions: number,
    totalSubmissions: number,
    pendingSubmissions: number,
    approvedSubmissions: number,
    rejectedSubmissions: number,
    completionRate: number,
    todayTasksAssigned: number,
    todayTasksSubmitted: number,
}

export interface UserOverviewResponse {
    userId: number,
    name: string,
    email: string,
    role: string,
    missionsAssigned: number,
    missionsCompleted: number,
    points: number,
    createdAt: string,
}

export interface ParentPerformanceResponse {
    parentId: number, 
    parentName: string, 
    assignedMissions: number, 
    completedMissions: number, 
    completionRate: number
}

export interface ChildPerformanceResponse {
    childId: number,
    childName: string,
    assignedMissions: number,
    completedMissions: number,
    validSubmissions: number,
    rejectedSubmissions: number,
    completionRate: number,
}

export interface CompletionChartResponse {
    week: string, 
    rate: number
}

export interface ActivityChartResponse {
    day: string, 
    assigned: number, 
    submitted: number 
}