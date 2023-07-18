import $api from "../http";
import {AxiosResponse} from "axios";
import {AuthResponse} from "../models/AuthResponse";
export default class AuthService{
    static async login(username: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/api/token/', {'username':username, 'password':password})
    }

}