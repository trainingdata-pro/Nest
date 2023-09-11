import $api, {API_URL} from "../http";
import axios, {AxiosResponse} from "axios";
import {AuthResponse} from "../models/AuthResponse";

interface RegisterResponse {

}
export default class AuthService{
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return axios.post<AuthResponse>(`${API_URL}/api/token/`, {'email':email, 'password':password})
    }
    static async register(username:string, email:string, password:string, status: string): Promise<AxiosResponse<RegisterResponse>> {
        return axios.post<AuthResponse>(`${API_URL}/api/users/`, {
            'email': email,
            'username': username,
            'password': password,
            'status': status
        })
    }
    static async confirmRegistration(code: string){
        return axios.post(`${API_URL}/api/activate_user/`, {"code": code})
    }

}