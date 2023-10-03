import {AxiosResponse} from "axios";
import $api from "../http";
import {
    Assessor,
    AssessorResponse,
    SkillResponse,
    WorkingHoursResponse,
    WorkloadStatusResponse
} from "../models/AssessorResponse";
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
export default class AssessorService{
    static fetchAssessors(projectId: any): Promise<AxiosResponse<AssessorResponse>> {
        return $api.get<AssessorResponse>(`/api/assessors/?projects=${projectId}`)
    }
    static addAssessor(data:any): any {
        return $api.post('/api/assessors/', data)
    }
    static fetchManagersAssessors(): Promise<AxiosResponse<AssessorResponse>> {
        return $api.get<AssessorResponse>('/api/assessors/')
    }
    static fetchAssessor(id: any): Promise<AxiosResponse<Assessor>> {
        return $api.get<Assessor>(`/api/assessors/${id}/`)
    }
    static addAssessorProject(id: string | number, data: string[]):Promise<AxiosResponse<Assessor>>{
        return $api.patch<Assessor>(`/api/assessors/${id}/projects/`, {"projects": data})
    }
    static fetchCredentials = (id: string | number | undefined) => $api.get<LoginAndPasswordResponse>(`/api/credentials/?assessor=${id}`).then((res) => res.data)
    static patchCredentials = (credId: string | number | undefined, data:any) => $api.patch(`/api/credentials/${credId}/`, data)
    static postCredentials = (data:any) => $api.post(`/api/credentials/`, data)

    static fetchAssessorHistory(id: string | number){
        return $api.get(`/api/history/?assessor=${id}`)
    }
    static getBlackList(){
        return $api.get('/api/blacklist/')
    }
    static fetchWorkloadStatus(assessorID: string | number):Promise<AxiosResponse<WorkloadStatusResponse>> {
        return $api.get<WorkloadStatusResponse>(`/api/workload_status/?assessor=${assessorID}`)
    }
    static fetchWorkingHours(assessorID: string | number): Promise<AxiosResponse<WorkingHoursResponse>> {
        return $api.get<WorkingHoursResponse>(`/api/working_hours/?assessor=${assessorID}`)
    }
    static fetchSkills():Promise<AxiosResponse<SkillResponse>>{
        return $api.get<SkillResponse>('/api/skills/')
    }
    static patchAssessor(assessorId: string | number|undefined, data:any){
        return $api.patch(`/api/assessors/${assessorId}/`, data)
    }
    static patchWorkloadStatus(workloadId: string | number, status: string ){
        return $api.patch(`/api/workload_status/${workloadId}/`, {
            status: status
        })
    }
    static createWorkloadStatus(data: any ){
        return $api.post(`/api/workload_status/`, data)
    }
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
//     static fetchAssessorSkills(id: string | number):Promise<AxiosResponse<SkillResponse>>{
//         return $api.get<SkillResponse>(`/api/skills/${id}/`)
//     }
}