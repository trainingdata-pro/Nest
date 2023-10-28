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
export interface ManagerResponse {
    results: Manager[],
    count: number,
}
export default class ManagerService{
    static fetchManager = (id: number | string) => $api.get<Manager>(`/api/managers/${id}`).then(res => res.data)
    static fetchTeamLeads = () => $api.get<any>(`/api/managers/?is_teamlead=true`).then(res => res.data)
    static fetchTeamLeadTeam = (teamleadId: number | string) => $api.get<ManagerResponse>(`/api/managers/?teamlead=${teamleadId}&page_size=all`).then(res => res.data)
    static patchManager = (managerId:number|string, data:any) => $api.patch(`/api/managers/${managerId}/`, {
            teamlead: Number(data.teamlead)
        }).then(res => res.data)

    static patchBaseUser = (managerId:number, data:any) => $api.patch(`/api/users/${managerId}/`, data).then(res => res.data)


}