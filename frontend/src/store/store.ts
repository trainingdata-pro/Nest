import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {API_URL} from "../http";
import ManagerService from "../services/ManagerService";
import Cookies from 'universal-cookie';
interface UserData {
    is_active: boolean,
    is_admin: boolean,
    email: string,
    status: string,
    username: string,
    is_teamlead: boolean
    teamlead: number


}

export interface Token {
    user_data: UserData,
    exp: number,
    user_id:number

}

export default class Store {
    user_id: number= 0
    isAuth = false
    managerData = {} as UserData
    isLoading = false
    showProfile = false
    cookies = new Cookies()
    authError = ''
    constructor() {
        makeAutoObservable(this)
    }

    setShowProfile(bool: boolean) {
        this.showProfile = bool
    }

    setIsLoading(bool: boolean) {
        this.isLoading = bool
    }

    setAuthError(error:string){
        this.authError = error
    }
    setAuth(bool: boolean) {
        this.isAuth = bool
    }
    setUserId(id:number){
        this.user_id = id
    }
    setManagerData(manager: UserData) {
        this.managerData = manager
    }

    async login(email: string, password: string) {
        await AuthService.login(email, password)
            .then(res => {
                console.log(res)
                localStorage.setItem('token', res.data.access)
                const decodeJwt: Token = jwtDecode(res.data.access)
                this.cookies.set('refresh', res.data.refresh, {path: '/', maxAge: decodeJwt.exp})
                console.log(decodeJwt)
                const managerId = decodeJwt.user_id
                this.setUserId(managerId)
                // ManagerService.fetch_manager(managerId).then(res => {
                //     this.setManagerData(res.data)
                //     const manager = res.data
                //     if (manager.first_name === '' || manager.last_name === '' || manager.middle_name === '' || !manager.is_operational_manager && manager.operational_manager === null){
                //         this.setShowProfile(true)
                //     }
                // })
                this.setAuth(true)
            })
            .catch(e => {
                const errJson = JSON.parse(e.request.response)
                this.setAuthError(errJson['detail'])
            })
    }
    async logout(){
        this.setAuth(false)
        localStorage.removeItem('token')
        this.cookies.remove('refresh')
    }

    async checkAuth() {
        this.setIsLoading(true)
        try {
            // const cookieValue = document.cookie
            //     .split('; ')
            //     .find((row) => row.startsWith('refresh='))?.split('=')[1];
            const response = await axios.post(`${API_URL}/api/token/refresh/`, {'refresh': this.cookies.get('refresh')})
            localStorage.setItem('token', response.data.access)
            const decodeJwt: Token = jwtDecode(response.data.access)
            const managerId = decodeJwt.user_id
            this.setUserId(decodeJwt.user_id)
            // await ManagerService.fetch_manager(managerId).then(res => {
            //     this.setManagerData(res.data.)
            //     const manager = res.data
            //     if (manager.first_name === '' || manager.last_name === '' || manager.middle_name === '' || !manager.is_operational_manager && manager.operational_manager === null){
            //         this.setShowProfile(true)
            //     }
            // })
            this.setAuth(true)
        } catch (e: any) {
            this.setAuth(false)
        } finally {
            this.setIsLoading(false)
        }
    }

}