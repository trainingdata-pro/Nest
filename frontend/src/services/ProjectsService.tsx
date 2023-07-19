import $api from "../http";
import {AxiosResponse} from "axios";
import {Project} from "../store/store";

interface addProject {
    id?: number
    name: string

}
export default class ProjectsService {
    static addProjects(data: Project){
        try{
            return $api.post('/api/projects/', data)
        } catch (e:any) {return e}

    }
    static fetchProjects(): any{
        return $api.get('/api/projects/')
    }
    static fetchManagerProjects(managerId: number): any{
        return $api.get(`/api/projects/?owner=${managerId}`)
    }
    static updateProjects(id: number,data: Project): Promise<AxiosResponse<Project>>{
        return $api.patch(`/api/projects/${id}/`, data)
    }
    static fetchCurrentProjects(id:any): Promise<AxiosResponse<Project>>{
        return $api.get(`/api/projects/${id}/`)
    }
    static deleteProjects(id:any): Promise<AxiosResponse<Project>>{
        return $api.delete(`/api/projects/${id}/`)
    }


}