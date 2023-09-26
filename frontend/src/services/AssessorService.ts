import {AxiosResponse} from "axios";
import $api from "../http";
import {Assessor, AssessorResponse} from "../models/AssessorResponse";
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
}