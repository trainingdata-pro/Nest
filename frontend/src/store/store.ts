import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import jwtDecode from "jwt-decode";
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
    isLoading = false


    constructor() {
        makeAutoObservable(this)
    }

    setIsLoading(bool: boolean) {
        this.isLoading = bool
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

    async login(username: string, password: string) {
        this.setIsLoading(true)
        const response = await AuthService.login(username, password)
        localStorage.setItem('token', response.data.access)
        const decodeJwt: Token = jwtDecode(response.data.access)
        this.setManager(decodeJwt.user_data)
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
            this.setManager(decodeJwt.user_data)
            this.setAuth(true)
        } catch (e: any) {
            this.setAuth(false)
        } finally {
            this.setIsLoading(false)
        }
    }

}