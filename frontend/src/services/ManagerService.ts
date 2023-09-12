import $api, {API_URL} from "../http";
import axios, {AxiosResponse} from "axios";
import {IManager, IUser} from "../models/ManagerResponse";

interface UsersResponse {
    results: IManager[]
}
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
        return $api.patch(`/api/user/${managerId}/`, {
            "username": data.username,
            "last_name": data.last_name,
            "first_name": data.first_name,
            "middle_name": data.middle_name
        })
    }
    static fetchOperationsManagers() {
        return $api.get('/api/users/?is_operational_manager=true')
    }

}