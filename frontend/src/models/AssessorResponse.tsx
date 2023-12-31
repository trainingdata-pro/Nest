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
    workload_status: WorkloadStatus[]
    vacation_date: string,
    free_resource_weekday_hours: string,
    free_resource_day_off_hours: string
}
type AssessorState = "available" | "busy" | "free_resource" | "vacation" | "blacklist" | "fired"
export interface ProjectAssessor {
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
    workload_status: WorkloadStatus[],
    vacation_date: string,
    free_resource_weekday_hours: string,
    free_resource_day_off_hours: string
}


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
    results: ProjectAssessor[]
    next: string,
    count: number
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
    action: 'created' | 'to_team' | 'rent' | 'add_project' | 'remove_project' | 'complete_project' | 'left' | 'unpin' | 'add_to_free_resource' | 'return_from_free_resource' | 'to_vacation' | 'from_vacation',
    attribute: 'full_name' | 'username' | 'manager' | 'project' | 'state',
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
    next: string,
    count: number
}
export interface FiredAssessor extends IFired {
    last_manager: string,
    last_project: string
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

export interface ProjectAssessors {
    id: number
    date_of_registration: string
    email: string
    first_name: string
    free_resource_day_off_hours: string
    free_resource_weekday_hours:string
    last_name: string
    manager: IManager
    middle_name: string
    skills: Skill[]
    username: string
    working_hours: WorkingHours
    workload_status: 'full' | 'partial' | 'reserved'
}