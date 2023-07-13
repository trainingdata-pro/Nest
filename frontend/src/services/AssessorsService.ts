import $api from "../http";
import {AxiosResponse} from "axios";

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

    static addAssessors(data: addAssessor): Promise<AxiosResponse<addAssessor>>{
        return $api.post('/api/assessors/', data)
    }

}