import {AxiosResponse} from "axios";
import $api from "../http";
import {Assessor, AssessorResponse} from "../models/AssessorResponse";

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
}