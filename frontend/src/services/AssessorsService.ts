import $api from "../http";
import {AxiosResponse} from "axios";
import {Project} from "../store/store";

interface IProject {
    id: number,
    name: string,
    date_of_create: string
}

interface IUser {
    id: number,
    username: string,
    email: string
}

interface IManager {
    id: number,
    user: IUser,
    last_name: string,
    first_name: string,
    middle_name: string,
    is_operational_manager: true,
    operational_manager: number
}

interface IAssessor {
    id: number,
    manager: IManager,
    projects: IProject[],
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string,
    is_busy: boolean,
    date_of_registration: string
}
interface addAssessor {
    id?: number,
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string
}
export default class AssessorsService {
    static fetchAssessors(): Promise<AxiosResponse> {
        return $api.get('/api/assessors/')
    }
    static fetchCurrentAssessors(id: number): Promise<AxiosResponse> {
        return $api.get(`/api/assessors/${id}/`)
    }
    static updateCurrentAssessors(id: number, data: any): Promise<AxiosResponse> {
        return $api.patch(`/api/assessors/${id}/`, data)
    }
    static addAssessors(data: addAssessor): Promise<AxiosResponse<addAssessor>>{
        try{
            return $api.post('/api/assessors/', data)
        } catch (e:any) {return e}
    }
    static deleteAssessors(id: any): any{
        try{
            return $api.delete(`/api/assessors/${id}/`)
        } catch (e:any) {return e}
    }
    static addAssessorToProject(id: number, projects: any){
        return $api.post(`/api/assessors/${id}/`, {"projects": projects})
    }

}