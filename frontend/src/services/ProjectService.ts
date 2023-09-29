import {AxiosResponse} from "axios";
import $api from "../http";
import {Project} from "../models/ProjectResponse";
import {AssessorResponse} from "../models/AssessorResponse";

interface ProjectResponse {
    count: number,
    next: string | null,
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
    static fetchProjects(managerID:string | number, page: string | number = 1, pageLimit: string | number = 10): Promise<AxiosResponse<ProjectResponse>> {
        return $api.get<ProjectResponse>(`/api/projects/?manager=${managerID}&page=${page}&page_size=${pageLimit}&status=new,pilot,active,pause`)
    }
    static fetchCompletedProjects(managerID:string | number): Promise<AxiosResponse<ProjectResponse>> {
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
    static fetchProjectsByAssessorID(id: string | number): Promise<AxiosResponse<ProjectResponse>>{
        return $api.get<ProjectResponse>(`/api/projects/?assessor_id=${id}`)
    }
}