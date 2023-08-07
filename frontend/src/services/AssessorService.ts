import {AxiosResponse} from "axios";
import $api from "../http";
import {AssessorResponse} from "../models/AssessorResponse";

export default class AssessorService{
    static fetchAssessors(projectId: any): Promise<AxiosResponse<AssessorResponse>> {
        return $api.get<AssessorResponse>(`/api/assessors/?projects=${projectId}`)
    }
}