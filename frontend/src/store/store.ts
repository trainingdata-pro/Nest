import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {API_URL} from "../http";
import ManagerService from "../services/ManagerService";

interface UserData {
    is_active: boolean,
    is_admin: boolean,
    is_operational_manager: boolean,
    manager_id: number,
    username: string
}

interface Token {
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

export interface ManagerData {
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
    operational_manager: number | null
}

export default class Store {
    isAuth = false
    managerData = {} as ManagerData
    isLoading = false
    showProfile = false

    constructor() {
        makeAutoObservable(this)
    }

    setShowProfile(bool: boolean) {
        this.showProfile = bool
    }

    setIsLoading(bool: boolean) {
        this.isLoading = bool
    }


    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setManagerData(manager: ManagerData) {
        this.managerData = manager
    }

    async login(username: string, password: string) {
        this.setIsLoading(true)
        const response = await AuthService.login(username, password)
        localStorage.setItem('token', response.data.access)
        const decodeJwt: Token = jwtDecode(response.data.access)
        const managerId = decodeJwt.user_data.manager_id
        await ManagerService.fetch_manager(managerId).then(res => {
            this.setManagerData(res.data)
            const manager = res.data
            if (manager.first_name === '' || manager.last_name === '' || manager.middle_name === '' || !manager.is_operational_manager && manager.operational_manager === null){
                this.setShowProfile(true)
            }
        })
        document.cookie = `refresh=${response.data.refresh}`
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
            const managerId = decodeJwt.user_data.manager_id
            await ManagerService.fetch_manager(managerId).then(res => {
                this.setManagerData(res.data)
                const manager = res.data
                if (manager.first_name === '' || manager.last_name === '' || manager.middle_name === '' || !manager.is_operational_manager && manager.operational_manager === null){
                    this.setShowProfile(true)
                }
            })
            this.setAuth(true)
        } catch (e: any) {
            this.setAuth(false)
        } finally {
            this.setIsLoading(false)
        }
    }

}