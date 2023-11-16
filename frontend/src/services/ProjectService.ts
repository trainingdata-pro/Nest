import $api from "../http";
import { Project, ProjectFormProps } from "../models/ProjectResponse";
import { ProjectResponse, TagResult } from "../models/ProjectResponse";


export default class ProjectService {
    static fetchProjects = (page = 1, sorting: string = '', pageLimit: number = 10) => $api.get<ProjectResponse>(`/api/projects/?page=${page}&status=active,pause&ordering=${sorting}&page_size=${pageLimit}`).then((res) => res.data)
    static fetchExcludedProjects = (page = 1, sorting: string = '', pageLimit: number = 10, assessorsIds: string = '') => $api.get<ProjectResponse>(`/api/projects/?page=${page}&status=active,pause&ordering=${sorting}&page_size=${pageLimit}&exclude_for_assessor=${assessorsIds}`).then((res) => res.data)
    static fetchProjectsForDelete = (page = 1, sorting: string = '', pageLimit: number = 10, assessorsIds: string = '') => $api.get<ProjectResponse>(`/api/projects/?page=${page}&status=active,pause&ordering=${sorting}&page_size=${pageLimit}&for_assessor=${assessorsIds}`).then((res) => res.data)
    static fetchProjectsByManager = (managerId: string | number) => $api.get<ProjectResponse>(`/api/projects/?manager=${managerId}&status=active,pause&page_size=all`).then((res) => res.data)
    static fetchCompletedProjects = (page = 1, sorting: string, pageLimit: number = 10) => $api.get<ProjectResponse>(`/api/projects/?page=${page}&page_size=${pageLimit}&status=completed&ordering=${sorting}`).then((res) => res.data)
    static fetchProject = (projectId: string | number) => $api.get<Project>(`/api/projects/${projectId}/`).then((res) => res.data)
    static postProject = (data: ProjectFormProps) => $api.post<Project>(`/api/projects/`, data).then((res) => res.data)
    static fetchProjectTags = () => $api.get<TagResult>('/api/tags/').then((res) => res.data)
    static patchProject = (id:any, data: ProjectFormProps) => $api.patch<Project>(`/api/projects/${id}/`, data).then((res) => res.data)
    static clearProject = (projectId: number) => $api.patch(`/api/projects/${projectId}/clear/`).then(res => res.data)
    static downloadFile = (filename: string) => $api.get(`/api/export/download/${filename}/`, {responseType: 'blob'})
    static exportProjects =(type: string) => $api.get(`/api/export/projects/?type=${type}`).then(res => res.data)
    static checkStatus = (taskId: string) => $api.get(`/api/export/status/${taskId}/`).then(res => res.data)
    static fetchProjectsByAssessorID = (id: string | number | undefined) => $api.get<ProjectResponse>(`/api/projects/?assessor_id=${id}`).then(res => res.data)
}