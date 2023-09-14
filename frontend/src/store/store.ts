import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {API_URL} from "../http";
import Cookies from 'universal-cookie';

interface UserData {
    is_admin: boolean,
    email: string,
    status: string,
    username: string,
    is_teamlead: boolean,
    teamlead: any,
    last_name: string,
    first_name: string,
    middle_name: string
}

export interface Token {
    user_data: UserData,
    exp: number,
    user_id: number

}

export default class Store {
    user_id: number = 0
    isAuth = false
    user_data = {} as UserData
    isLoading = false
    cookies = new Cookies()
    authError = ''
    constructor() {
        makeAutoObservable(this)
    }
    setIsLoading(bool: boolean) {
        this.isLoading = bool
    }

    setAuthError(error: string) {
        this.authError = error
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setUserId(id: number) {
        this.user_id = id
    }

    setUserData(manager: UserData) {
        this.user_data = manager
    }

    async login(email: string, password: string) {
        await AuthService.login(email, password)
            .then(res => {
                localStorage.setItem('token', res.data.access)
                const decodeJwt: Token = jwtDecode(res.data.access)
                this.cookies.set('refresh', res.data.refresh, {path: '/', maxAge: decodeJwt.exp})
                const managerId = decodeJwt.user_id
                const user_data = decodeJwt.user_data
                this.setUserData(user_data)
                this.setUserId(managerId)
                this.setAuth(true)
            })
            .catch(e => {
                const errJson = JSON.parse(e.request.response)
                this.setAuthError(errJson['detail'])
            })
    }

    async logout() {
        this.setAuth(false)
        localStorage.removeItem('token')
        this.cookies.remove('refresh')
    }

    async checkAuth() {
        this.setIsLoading(true)
        try {
            const response = await axios.post(`${API_URL}/api/token/refresh/`, {'refresh': this.cookies.get('refresh')})
            localStorage.removeItem('token')
            localStorage.setItem('token', response.data.access)
            const decodeJwt: Token = jwtDecode(response.data.access)
            const managerId = decodeJwt.user_id
            const user_data = decodeJwt.user_data
            this.setUserId(managerId)
            this.setUserData(user_data)
            this.setAuth(true)
        } catch (e: any) {
            this.setAuth(false)
        } finally {
            this.setIsLoading(false)
        }
    }

}