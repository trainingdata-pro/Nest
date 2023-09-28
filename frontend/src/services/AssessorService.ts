import {AxiosResponse} from "axios";
import $api from "../http";
import {Assessor, AssessorResponse, SkillResponse} from "../models/AssessorResponse";
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
    static fetchCredentials(id: string | number):Promise<AxiosResponse<LoginAndPasswordResponse>>{
        return $api.get<LoginAndPasswordResponse>(`/api/credentials/?assessor=${id}`)
    }
    static patchCredentials(credId: string, data:any){
        return $api.patch(`/api/credentials/${credId}/`, data)
    }
    static fetchAssessorHistory(id: string | number){
        return $api.get(`/api/history/?assessor=${id}`)
    }
    static getBlackList(){
        return $api.get('/api/blacklist/')
    }
    static fetchWorkloadStatus(assessorID: string | number) {
        return $api.get(`/api/workload_status/?assessor=${assessorID}`)
    }
    static fetchWorkingHours(assessorID: string | number) {
        return $api.get(`/api/working_hours/?assessor=${assessorID}`)
    }
    static fetchSkills():Promise<AxiosResponse<SkillResponse>>{
        return $api.get<SkillResponse>('/api/skills/')
    }
    static patchAssessor(assessorId: string | number, data:any){
        return $api.patch(`/api/assessors/${assessorId}/`, data)
    }
//     static fetchAssessorSkills(id: string | number):Promise<AxiosResponse<SkillResponse>>{
//         return $api.get<SkillResponse>(`/api/skills/${id}/`)
//     }
}