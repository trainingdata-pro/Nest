import {API_URL} from "../http";
import axios, {AxiosResponse} from "axios";
import {AuthResponse} from "../models/AuthResponse";
import {ISignUp} from "../pages/SignUpPage";

interface RegisterResponse {

}
export default class AuthService{
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return axios.post<AuthResponse>(`${API_URL}/api/token/`, {'email':email, 'password':password})
    }
    static async register(data:ISignUp): Promise<AxiosResponse<RegisterResponse>> {
        return axios.post<AuthResponse>(`${API_URL}/api/users/`, {
            ...data
        })
    }
    static async confirmRegistration(code: string){
        return axios.post(`${API_URL}/api/activate_user/`, {"code": code})
    }

}