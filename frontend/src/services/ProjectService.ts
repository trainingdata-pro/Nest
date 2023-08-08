import {AxiosResponse} from "axios";
import $api from "../http";
import {Project} from "../models/ProjectResponse";

interface ProjectResponse {
    results: Project[]
}

export default class ProjectService {
    static fetchProjects(id:any): Promise<AxiosResponse<ProjectResponse>> {
        return $api.get<ProjectResponse>(`/api/projects/?manager=${id}`)
    }
    static fetchProject(projectId: any): Promise<AxiosResponse<Project>>{
        return $api.get<Project>(`/api/projects/${projectId}/`)
    }
    static addProject(data: any): Promise<AxiosResponse<Project>> {
        return $api.post<Project>(`/api/projects/`, data)

    }
    static patchProject(id:any,data: any): Promise<AxiosResponse<Project>> {
        return $api.patch<Project>(`/api/projects/${id}/`, data)

    }
}