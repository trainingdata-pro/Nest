import {IManager} from "./ManagerResponse";
import {Project} from "./ProjectResponse";

export interface Skill {
    id: number,
    title: string
}
export interface SkillResponse {
    results: Skill[]
}

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
    assessor: number
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
    status: string,
    assessor: number
}
export interface IAssessorProjects extends Project{
    workingHours: WorkingHours,
    workloadStatus: WorkloadStatus
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
    status: string,
    email: string,
    country: string,
    is_free_resource: boolean,
    blacklist: boolean,
    date_of_registration: string,
    working_hours: AssessorWorkingTime


}

export interface AssessorWorkingTime {
    id: number,
    monday: number,
    tuesday: number,
    wednesday: number,
    thursday: number,
    friday: number,
    saturday: number,
    sunday: number
}

export interface AssessorResponse {
    results: Assessor[]
}