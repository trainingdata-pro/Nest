import {AxiosResponse} from "axios";
import $api from "../http";
import {
    Assessor,
    AssessorResponse,
    IBlackListResponse,
    IFiredResponse,
    IFreeResourcesResponse,
    IHistoryResponse,
    IReasonResponse,
    SkillResponse,
    WorkingHoursResponse,
    WorkloadStatusResponse
} from "../models/AssessorResponse";
import {Project} from "../models/ProjectResponse";
import {Manager} from "./ManagerService";
import {IUser} from "../models/ManagerResponse";

export type ILoginAndPassword = {
    id: number,
    assessor: Assessor,
    login: string,
    tool: string,
    password: string
}
export type LoginAndPasswordResponse = {
    results: ILoginAndPassword[]
}


export interface ICheckAssessor {
    pk: number,
    last_name: string,
    first_name: string,
    middle_name: string,
    projects: Project[],
    manager: IUser,
    state: "available" | "busy" | "free_resource" | "vacation" | "blacklist" | "fired",
    username: string,
    last_project: string,
    last_manager: string
}

export type CheckAssessorResponse = {
    results: ICheckAssessor[],
    count: number

}
export default class AssessorService{
    static fetchAssessors = (page: number | string,projectId: any, ordering: string = '', skills: string='', status: string = '',pageLimit: number = 10) => $api.get<AssessorResponse>(`/api/projects/${projectId}/assessors/?page=${page}&page_size=${pageLimit}&ordering=${ordering}&skills=${skills}&workload_status=${status}`).then(res => res.data)
    static addAssessor = (data:any) => $api.post<Assessor>('/api/assessors/', data).then(res => res.data)
    static fetchManagersAssessors = ( page:number|string, sorting: string = '', skills: string='', pageLimit: number = 10) => $api.get<AssessorResponse>(`/api/assessors/?page=${page}&page_size=${pageLimit}&ordering=${sorting}&skills=${skills}&exclude_rented=true`).then(res => res.data)
    static fetchRentAssessors = (page: number | string, sorting: string = '', skills: string='', pageLimit: number = 10) => $api.get<AssessorResponse>(`/api/assessors/?page=${page}&page_size=${pageLimit}&ordering=${sorting}&skills=${skills}&exclude_rented=false`).then(res => res.data)
    static fetchAssessor = (id: any) => $api.get<Assessor>(`/api/assessors/${id}/`).then(res => res.data)
    static addAssessorProject = (id: string | number, data: any) => $api.patch<Assessor>(`/api/assessors/${id}/projects/`, data).then(res => res.data)
    static fetchCredentials = (id: string | number | undefined) => $api.get<LoginAndPasswordResponse>(`/api/credentials/?assessor=${id}`).then((res) => res.data)
    static patchCredentials = (credId: string | number | undefined, data:any) => $api.patch(`/api/credentials/${credId}/`, data)
    static postCredentials = (data:any) => $api.post(`/api/credentials/`, data)
    static fetchHistoryByAssessor = (assessorId: string | number | undefined, page: string | number = 1, pageLimit:number = 10) => $api.get<IHistoryResponse>(`/api/history/?ordering=-timestamp&assessor=${assessorId}&page=${page}&page_size=${pageLimit}`).then(res => res.data)
    static fetchAssessorHistory = (id: string | number | undefined, attribute: string) => $api.get<IHistoryResponse>(`/api/history/?attribute=${attribute}&ordering=-timestamp&assessor=${id}`).then(res => res.data)
    static getBlackList = (page: string | number = 1,filter:string, sorting:string = '', pageLimit: number = 10) => $api.get<IBlackListResponse>(`/api/blacklist/?page=${page}&name=${filter}&ordering=${sorting}&page_size=${pageLimit}`).then(res => res.data)
    static getBlackListAll = (filter:string) => $api.get<IBlackListResponse>(`/api/blacklist/?name=${filter}&page_size=all`).then(res => res.data)

    static fetchWorkloadStatus = (assessorID: string | number | undefined, projectId: string | number| undefined = undefined) => $api.get<WorkloadStatusResponse>(`/api/workload_status/?assessor=${assessorID}&project=${projectId}`).then(res => res.data)
    static fetchWorkingHours = (assessorID: string | number | undefined, projectId: string | number| undefined = undefined) => $api.get<WorkingHoursResponse>(`/api/working_hours/?assessor=${assessorID}&project=${projectId}`).then(res => res.data)
    static fetchSkills = () => $api.get<SkillResponse>('/api/skills/').then(res => res.data)
    static patchAssessor = (assessorId: string | number|undefined, data:any) => $api.patch(`/api/assessors/${assessorId}/`, data)
    static patchWorkloadStatus(workloadId: string | number | undefined, status: string ){
        return $api.patch(`/api/workload_status/${workloadId}/`, status)
    }
    static patchAssessorSkills = (id: string | number, skills: string[]|number[]) => $api.patch(`/api/assessors/${id}/skills/`, {
        skills : skills
    })
    static createWorkloadStatus = (data: any ) => $api.post(`/api/workload_status/`, data).then(res => res.data)
    static patchWorkingHours(workingHoursId: string | number, data:any ){
        return $api.patch(`/api/working_hours/${workingHoursId}/`, data)
    }
    static createWorkingHours(data: any ){
        return $api.post(`/api/working_hours/`, data)
    }
    static addToFreeResource = (assessorId:number| string | undefined, data:any) => $api.patch(`/api/assessors/${assessorId}/free_resource/`, {
        free_resource: data.free_resource,
        reason: data.reason,
        free_resource_weekday_hours: data.free_resource_weekday_hours,
        free_resource_day_off_hours: data.free_resource_day_off_hours
    }).then((res) => res.data)
    static fetchFreeResource = (page = 1, ordering: string, nameFilter:string,skillsFilter:string, pageLimit: number = 10) => $api.get<IFreeResourcesResponse>(`/api/free_resources/?page=${page}&page_size=${pageLimit}&ordering=${ordering}&name=${nameFilter}&skills=${skillsFilter}`).then(res => res.data)
    static patchVacation = (assessorId: string | number |undefined, data: any) => $api.patch(`/api/assessors/${assessorId}/vacation/`, data).then(res => res.data)
    static fetchReasons = () => $api.get<IReasonResponse>('/api/reasons/?page_size=all').then(res => res.data)
    static addAssessorToFired = (id: string| number| undefined, data: any) => $api.patch(`/api/assessors/${id}/fire/`, data).then(res => res.data)
    static fetchFired = (page = 1,ordering: string, nameFilter:string,skillsFilter:string, pageLimit: number = 10) => $api.get<IFiredResponse>(`/api/fired/?page=${page}&page_size=${pageLimit}&ordering=${ordering}&name=${nameFilter}&skills=${skillsFilter}`).then(res => res.data)
    static takeFromFreeResource = (assessorId: string | number, data: any) => $api.patch(`/api/free_resources/${assessorId}/`, data).then(res => res.data)
    static unpinAssessor = (assessorId: string | number, data: any) => $api.patch(`/api/assessors/${assessorId}/unpin/`, data).then(res => res.data)
    static returnFromFreeResources = (assessorId:number| string | undefined, data:any) => $api.patch(`/api/assessors/${assessorId}/free_resource/`, data).then(res => res.data)
    static exportProjectAssessors = (type: string, projectId: number | string) => $api.get(`/api/export/assessors/?type=${type}&project=${projectId}`).then(res => res.data)
    static exportBlackList = (type: string, items:string) => $api.get(`/api/export/blacklist/?type=${type}&items=${items}`).then(res => res.data)
    static checkAssessor = (page: number, name: string, pageLimit: number = 10) => $api.get<CheckAssessorResponse>(`/api/assessors/check/?name=${name}&page=${page}&page_size=${pageLimit}`).then(res => res.data)
    static takeFromOwnDesires = (firedId: string | number, data:any) => $api.patch(`/api/fired/${firedId}/back/`, data)
}