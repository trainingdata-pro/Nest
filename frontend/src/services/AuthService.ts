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
    static register = (data:any) => axios.post<AuthResponse>(`${API_URL}/api/users/`, data).then(res => res.data)
    static async confirmRegistration(code: string){
        return axios.post(`${API_URL}/api/activate_user/`, {"code": code})
    }
    static async resetPassword(code: string, password: string){
        return axios.post(`${API_URL}/api/password/set/`, {"token": code, password: password})
    }

    static async sendResetEmail(email: string){
        return axios.post(`${API_URL}/api/password/reset/`, {email:email})
    }



}