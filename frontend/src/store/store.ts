import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {IManager} from "../models/ManagerResponse";
import ProjectsService from "../services/ProjectsService";
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
        // is_operational_manager: boolean,
        // operational_manager: number
    }
}
export default class Store {
    isAuth = false
    errors = []
    manager = {} as IManager
    managerInfo = {} as ManagerInfo
    isLoading = false
    hiddenAddAssessor = false
    projects = [] as Project[]
    showConfirm = false
    selectedRow = null
    constructor() {
        makeAutoObservable(this)
    }
    setSelectedRows(selectedRow:any){
        this.selectedRow = selectedRow
    }
    setIsLoading(bool: boolean){
        this.isLoading = bool
    }
    setError(errors:[]){
        this.errors = errors
    }
    setShowConfirm(bool:boolean){
        this.showConfirm = bool
    }
    setHiddenAddAssessor(bool: boolean){
        this.hiddenAddAssessor = bool
    }
    setProjects(projects:any){
        this.projects = projects
    }
    fetchProjects(){
        // @ts-ignore
        ProjectsService.fetchProjects().then(res => this.setProjects(res.data.results))
    }
    addProject(values:any) {
        ProjectsService.addProjects(values).then(res => {
            this.setProjects([...this.projects, res.data])
            this.setHiddenAddAssessor(false)
        }).catch((e) => {
            this.setError(e.response.data.name)
        })
    }
    deleteProject(id:any){
        ProjectsService.deleteProjects(id).then(res => this.setProjects([...this.projects.filter(res => res.id !== id)]))
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
        this.setManagerInfo(decodeJwt)
        document.cookie = `refresh=${response.data.refresh}`
        // ManagerService.fetch_manager(decodeJwt.manager_id).then(res => this.setManager(res.data))
        this.setAuth(true)
        this.setIsLoading(false)
    }

    async checkAuth() {
        this.setIsLoading(true)
        try {
            const cookieValue = document.cookie
                .split('; ')
                .find((row) => row.startsWith('refresh='))?.split('=')[1];
            const response = await axios.post(`http://192.168.1.9:8000/api/token/refresh/`, {'refresh': cookieValue})
            localStorage.setItem('token', response.data.access)
            const decodeJwt: ManagerInfo = jwtDecode(response.data.access)
            this.setManagerInfo(decodeJwt)
            // await ManagerService.fetch_manager(decodeJwt.manager_id).then(res => this.setManager(res.data))
            this.setAuth(true)
        } catch (e: any) {
            this.setAuth(false)
        } finally {
            this.setIsLoading(false)
        }
    }

}