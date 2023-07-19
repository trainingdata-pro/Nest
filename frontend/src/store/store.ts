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

interface ManagerInfo {
    manager_id: number,
    username: string,
    id_admin: boolean
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
export default class Store {
    isAuth = false
    errors = []
    manager = {} as IManager
    assessors = [] as IAssessor[]
    managerInfo = {} as ManagerInfo
    isLoading = false
    projects = [] as Project[]
    showConfirm = false
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

    fetchProjects() {
        // @ts-ignore
        ProjectsService.fetchProjects().then(res => this.setProjects(res.data.results))
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

    async deleteProject() {
        // @ts-ignore
        this.selectedRow.map(k => {
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

    setManagerInfo(managerInfo: ManagerInfo) {
        this.managerInfo = managerInfo
    }

    setManager(manager: IManager) {
        this.manager = manager
    }

    async login(username: string, password: string) {
        this.setIsLoading(true)
        const response = await AuthService.login(username, password)
        localStorage.setItem('token', response.data.access)
        const decodeJwt: ManagerInfo = jwtDecode(response.data.access)
        console.log(jwtDecode(response.data.access))
        console.log(decodeJwt)
        this.setManagerInfo(decodeJwt)
        this.setCurrentProjectManager1(decodeJwt.manager_id)
        document.cookie = `refresh=${response.data.refresh}`
        ManagerService.fetch_manager(decodeJwt.manager_id).then(res => this.setManager(res.data))
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
            const decodeJwt: ManagerInfo = jwtDecode(response.data.access)
            this.setManagerInfo(decodeJwt)
            await ManagerService.fetch_manager(decodeJwt.manager_id).then(res => this.setManager(res.data))
            this.setCurrentProjectManager1(decodeJwt.manager_id)
            this.setAuth(true)
        } catch (e: any) {
            this.setAuth(false)
        } finally {
            this.setIsLoading(false)
        }
    }

}