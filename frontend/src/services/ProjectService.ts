import {AxiosResponse} from "axios";
import $api from "../http";
import {Project} from "../models/ProjectResponse";
import {Assessor, AssessorResponse} from "../models/AssessorResponse";

interface ProjectResponse {
    count: number,
    results: Project[]
}
export interface Tag {
    id: number,
    name: string,
}
interface TagResult {
    results: Tag[]
}
export default class ProjectService {
    static fetchProjects(managerID:string): Promise<AxiosResponse<ProjectResponse>> {
        return $api.get<ProjectResponse>(`/api/projects/?&manager=${managerID}`)
    }
    static fetchCompletedProjects(managerID:string): Promise<AxiosResponse<ProjectResponse>> {
        return $api.get<ProjectResponse>(`/api/projects/?manager=${managerID}&status=completed`)
    }
    static fetchProject(projectId: any): Promise<AxiosResponse<Project>>{
        return $api.get<Project>(`/api/projects/${projectId}/`)
    }
    static addProject(data: any): Promise<AxiosResponse<Project>> {
        return $api.post<Project>(`/api/projects/`, data)

    }
    static fetchProjectTags(): Promise<AxiosResponse<TagResult>> {
        return $api.get<TagResult>('/api/tags/')
    }
    static patchProject(id:any,data: any): Promise<AxiosResponse<Project>> {
        return $api.patch<Project>(`/api/projects/${id}/`, data)

    }
    static fetchProjectAssessors(id:any): Promise<AxiosResponse<AssessorResponse>> {
        return $api.get<AssessorResponse>(`/api/projects/${id}/assessors/`,)

    }
}