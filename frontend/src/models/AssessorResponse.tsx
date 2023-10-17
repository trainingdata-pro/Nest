import {IManager} from "./ManagerResponse";
import {Project} from "./ProjectResponse";
import {FreeAssessor} from "../components/FreeResource/FreeResorces/FreeResource";

export interface Skill {
    id: number,
    title: string
}
export interface SkillResponse {
    results: Skill[]
}
export type PatchWorkingHours = Omit<WorkingHours, "project" | "assessor" | "id" | "total">
export interface WorkingHours {
    id:number,
    project: {
        id: number,
        name: string,
        manager: IManager[],
    }
    total: number,
    monday: number,
    tuesday: number,
    wednesday: number,
    thursday: number,
    friday: number,
    saturday: number,
    sunday: number
    assessor: number | string | undefined
}

export interface WorkingHoursResponse {
    results: WorkingHours[]
}
export interface WorkloadStatus {
    id:number,
    project: {
        id: number,
        name: string,
        manager: IManager[],
    }
    status: Status,
    assessor: number
}
type Status = 'full' | 'partial' | 'reserved'
export interface IAssessorProjects extends Project{
    workingHours?: WorkingHours,
    workloadStatus?: WorkloadStatus
}
export interface WorkloadStatusResponse {
    results: WorkloadStatus[]
}
export interface Assessor {
    id: number,
    manager: IManager,
    projects: Project[],
    skills: Skill[],
    second_manager: IManager[],
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string,
    email: string,
    country: string,
    state: AssessorState
    date_of_registration: string,
    working_hours: WorkingHours[],
    vacation_date: string,
    free_resource_weekday_hours: string,
    free_resource_day_off_hours: string
}
type AssessorState = "available" | "busy" | "free_resource" | "vacation" | "blacklist" | "fired"



export interface AssessorWorkingTime {
    id: number,
    monday: number,
    tuesday: number,
    wednesday: number,
    thursday: number,
    friday: number,
    saturday: number,
    sunday: number,
}

export interface AssessorResponse {
    results: Assessor[]
    next: string
}

export interface IFreeResources extends Assessor{
    "vacation_date": string,
    "free_resource_weekday_hours": string,
    "free_resource_day_off_hours": string
}
export interface IFreeResourcesResponse {
    results: FreeAssessor[]
    count: number,
    next: string | null,
}

export interface IHistory {
    action: string,
    attribute: string,
    id: number,
    new_value: string,
    old_value: string,
    reason: string,
    timestamp: string,
    user: string
}
export interface IHistoryResponse {
    results: IHistory[],
    count: number,
    next: string
}

export interface IReason {
    id: number,
    title: string,
    blacklist_reason: boolean
}
export interface IReasonResponse {
    results: IReason[]
}
export interface IBlackList {
    id: number
    assessor: Assessor,
    reason: IReason,
    date: string,
    last_manager?: string,
    last_project?: string
}
export interface IBlackListResponse {
    results: IBlackList[],
    next: string
}

export interface IFired {
    id: number,
    assessor: Assessor,
    reason: IReason,
    date: string,
    possible_return_date: string
    last_manager: string,
    last_project: string
}

export interface IFiredResponse {
    results: IFired[]
    count: number
    next: string
}