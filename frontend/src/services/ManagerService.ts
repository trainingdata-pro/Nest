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
    id: number,
    user: IUser,
    teamlead: IUser,
    is_teamlead: boolean}

export default class ManagerService{
    static fetch_manager = (id: number | string) => $api.get<IManager>(`/api/users/${id}`).then(res => res.data)
    static fetchManager = (id: number | string) => $api.get<Manager>(`/api/managers/${id}`).then(res => res.data)
    static fetchTeamLeads = () => $api.get<any>(`/api/managers/?is_teamlead=true`)
    static fetch_managers(): Promise<AxiosResponse<UsersResponse>> {
        return $api.get<UsersResponse>(`/api/users/?is_teamlead=false`)
    }

    static patchManager = (managerId:number|string, data:any) => $api.patch(`/api/managers/${managerId}/`, {
            teamlead: Number(data.teamlead)
        }).then(res => res.data)

    static patchBaseUser(managerId:number, data:any) {
        return $api.patch(`/api/users/${managerId}/`, data).then(res => res.data)
    }
    static fetchOperationsManagers = () => $api.get('/api/users/?is_teamlead=true').then(res => res.data)

}