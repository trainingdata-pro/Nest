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
    static fetchProjects = (page = 1) => $api.get<ProjectResponse>(`/api/projects/?page=${page}&status=active,pause`).then((res) => res.data)
    static fetchCompletedProjects = (page = 1) => $api.get<ProjectResponse>(`/api/projects/?page=${page}&status=completed`).then((res) => res.data)
    static fetchProject = (projectId: string | number | undefined) => $api.get<Project>(`/api/projects/${projectId}/`).then((res) => res.data)
    static postProject = (data: any) => $api.post<Project>(`/api/projects/`, data).then((res) => res.data)
    static fetchProjectTags = () => $api.get<TagResult>('/api/tags/').then((res) => res.data)
    static patchProject = (id:any,data: any) => $api.patch<Project>(`/api/projects/${id}/`, data).then((res) => res.data)
    static fetchProjectAssessors(id:any): Promise<AxiosResponse<AssessorResponse>> {
        return $api.get<AssessorResponse>(`/api/projects/${id}/assessors/`)
    }
    static downloadFile = (filename: string) => $api.get(`/api/export/download/${filename}/`)
    static exportProjects =(type: string) => $api.get(`/api/export/projects/?type=${type}`).then(res => res.data)
    static checkStatus = (taskId: string) => $api.get(`/api/export/status/${taskId}/`).then(res => res.data)
    static fetchProjectsByAssessorID = (id: string | number | undefined) => $api.get<ProjectResponse>(`/api/projects/?assessor_id=${id}`).then(res => res.data)
}