import {AxiosResponse} from "axios";
import $api from "../http";
import {ManagerData} from "../store/store";

export interface Project {
    id: number,
    manager: ManagerData,
    assessors_count: number,
    backlog: string,
    name: string,
    speed_per_hour: number,
    price_for_assessor: number,
    price_for_customer: number,
    unloading_value: number,
    unloading_regularity: number,
    status: [],
    date_of_creation: string

}
interface ProjectResponse{
    results: Project[]
}
export default class ProjectService{
    static fetchProjects(id: number): Promise<AxiosResponse<ProjectResponse>> {
        return $api.get<ProjectResponse>(`/api/projects/?manager=${id}`)
    }
    static addProject(project_id: number, data: Project): Promise<AxiosResponse<Project>> {
        return $api.post<Project>(`/api/projects/${project_id}/`, data)
    }



}