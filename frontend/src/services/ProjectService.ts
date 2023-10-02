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
    static fetchProjects = (user_id: number | string, page = 1, pageLimit = 10) => $api.get<ProjectResponse>(`/api/projects/?manager=${user_id}&page=${page}&page_size=${pageLimit}&status=new,pilot,active,pause`).then((res) => res.data)

    static fetchCompletedProjects(managerID:string | number): Promise<AxiosResponse<ProjectResponse>> {
        return $api.get<ProjectResponse>(`/api/projects/?manager=${managerID}&status=completed`)
    }
    static fetchProject = (projectId: string | number) => $api.get<Project>(`/api/projects/${projectId}/`).then((res) => res.data)
    static postProject = (data: any) => $api.post<Project>(`/api/projects/`, data).then((res) => res.data)
    static fetchProjectTags = () => $api.get<TagResult>('/api/tags/').then((res) => res.data)


    static patchProject = (id:any,data: any) => $api.patch<Project>(`/api/projects/${id}/`, data).then((res) => res.data)

    static fetchProjectAssessors(id:any): Promise<AxiosResponse<AssessorResponse>> {
        return $api.get<AssessorResponse>(`/api/projects/${id}/assessors/`,)
    }
    static fetchProjectsByAssessorID(id: string | number): Promise<AxiosResponse<ProjectResponse>>{
        return $api.get<ProjectResponse>(`/api/projects/?assessor_id=${id}`)
    }
}