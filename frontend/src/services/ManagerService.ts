import $api from "../http";
import {AxiosResponse} from "axios";
import {IManager} from "../models/ManagerResponse";

interface UsersResponse {
    results: IManager[]
}
interface IUser {
    id: number,
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string
    email: string,
    status: string
}
export interface Manager {
    user: IUser,
    teamlead: IUser,
    is_teamlead: boolean}

export default class ManagerService{
    static fetch_manager(id: number | string): Promise<AxiosResponse<IManager>> {
        return $api.get<IManager>(`/api/users/${id}`)
    }
    static fetch_managers(): Promise<AxiosResponse<UsersResponse>> {
        return $api.get<UsersResponse>(`/api/users/?is_teamlead=false`)
    }

    static patchManager(managerId:number, data:any) {
        return $api.patch(`/api/managers/${managerId}/`, {
            "teamlead": Number(data.operational_manager)
        })
    }
    static patchBaseUser(managerId:number, data:any) {
        return $api.patch(`/api/users/${managerId}/`, {
            "username": data.username,
            "last_name": data.last_name,
            "first_name": data.first_name,
            "middle_name": data.middle_name
        })
    }
    static fetchOperationsManagers = () => $api.get('/api/users/?is_teamlead=true').then(res => res.data)

}