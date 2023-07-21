import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {IManager} from "../models/ManagerResponse";
import ProjectsService from "../services/ProjectsService";
import ManagerService from "../services/ManagerService";
import {IAssessor} from "../models/AssessorResponse";
import AssessorsService from "../services/AssessorsService";
import {API_URL} from "../http";

interface UserData{
    is_active: boolean,
    is_admin: boolean,
    is_operational_manager: boolean,
    manager_id: number,
    username: string
}
interface Token{
    user_data: UserData
}
export type Project = {
    id?: number
    name: string
    owner?: {
        id: number,
        user: {
            id: number,
            username: string,
            email: string
        },
        last_name: string,
        first_name: string,
        middle_name: string,
    }
}
interface ManagerData {
    id: number,
    user: {
        id: number,
        username: string,
        email: string
    },
    last_name: string,
    first_name: string,
    middle_name: string,
    is_operational_manager: boolean,
    operational_manager: number
}
export default class Store {
    isAuth = false
    manager = {} as UserData
    managerData = {} as ManagerData


    assessors = [] as IAssessor[]
    isLoading = false
    projects = [] as Project[]
    selectedRow = null
    selectedRowAssessors = null
    currentProjectManager = {} as IManager

    constructor() {
        makeAutoObservable(this)
    }

    setSelectedRow(selectedRow: any) {
        this.selectedRow = selectedRow
    }
    setSelectedRowAssessors(selectedRow: any) {
        this.selectedRowAssessors = selectedRow
    }

    setIsLoading(bool: boolean) {
        this.isLoading = bool
    }

    setCurrentProjectManager(manager:IManager){
        this.currentProjectManager = manager
    }
    setCurrentProjectManager1(id: number) {
        ManagerService.fetch_manager(id).then(res => {
            this.setCurrentProjectManager(res.data)
            console.log(this.currentProjectManager)
        })
    }

    setProjects(projects: any) {
        this.projects = projects
    }
    setAssessors(assessors:any){
        this.assessors = assessors
    }

    fetchProjects(managerId: number) {
        // @ts-ignore
        ProjectsService.fetchManagerProjects(managerId).then(res => this.setProjects(res.data.results))
    }
    fetchAssessors() {
        // @ts-ignore
        AssessorsService.fetchAssessors().then(res => this.setAssessors(res.data.results))
    }

    async addProject(values: any) {
        return await ProjectsService.addProjects(values)
    }
    async addAssessor(values: any) {
        return await AssessorsService.addAssessors(values)
    }

    async deleteProject(ids: number[]) {
        // @ts-ignore
        ids.map(k => {
            ProjectsService.deleteProjects(k).then(() => this.setProjects([...this.projects.filter(res => res.id !== k)]))
        })
    }
    async deleteAssessors() {
        // @ts-ignore
        this.selectedRowAssessors.map(k => {
            AssessorsService.deleteAssessors(k).then(() => this.setAssessors([...this.assessors.filter(res => res.id !== k)]))
        })
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setManager(manager: UserData) {
        this.manager = manager
    }
    setManagerData(manager: ManagerData) {
        this.managerData = manager
    }
    getProjectCount(id:number){
        return ProjectsService.getProjectsAssessorsCount(id).then(res => res.data.count)
    }
    async login(username: string, password: string) {
        this.setIsLoading(true)
        const response = await AuthService.login(username, password)
        localStorage.setItem('token', response.data.access)
        const decodeJwt: Token = jwtDecode(response.data.access)
        this.setManager(decodeJwt.user_data)
        document.cookie = `refresh=${response.data.refresh}`
        await ManagerService.fetch_manager(decodeJwt.user_data.manager_id).then(res => this.setManagerData(res.data))
        this.setAuth(true)
        this.setIsLoading(false)
    }

    async checkAuth() {
        this.setIsLoading(true)
        try {
            const cookieValue = document.cookie
                .split('; ')
                .find((row) => row.startsWith('refresh='))?.split('=')[1];
            const response = await axios.post(`${API_URL}/api/token/refresh/`, {'refresh': cookieValue})
            localStorage.setItem('token', response.data.access)
            const decodeJwt: Token = jwtDecode(response.data.access)
            this.setManager(decodeJwt.user_data)
            await ManagerService.fetch_manager(decodeJwt.user_data.manager_id).then(res => this.setManagerData(res.data))
            this.setAuth(true)
        } catch (e: any) {
            this.setAuth(false)
        } finally {
            this.setIsLoading(false)
        }
    }

}