import $api from "../http";
import {AxiosResponse} from "axios";

interface IUser {
    id: number,
    username: string,
    email: string
}
interface IManager {
    id: number,
    user: IUser,
    last_name: string,
    first_name: string,
    middle_name: string,
    is_operational_manager: boolean,
    operational_manager: number
}
export default class ManagerService{
    static fetch_manager(id: number): Promise<AxiosResponse<IManager>> {
        return $api.get<IManager>(`/api/users/${id}`)
    }
    static fetch_managers(): any {
        return $api.get<IManager[]>(`/api/users/`)
    }

}