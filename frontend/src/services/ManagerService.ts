import $api, {API_URL} from "../http";
import axios, {AxiosResponse} from "axios";
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

interface ManagerResponse {
    results: IManager[]
}
export default class ManagerService{
    static fetch_manager(id: number): Promise<AxiosResponse<IManager>> {
        return $api.get<IManager>(`/api/users/${id}`)
    }
    static fetch_managers(): Promise<AxiosResponse<ManagerResponse>> {
        return $api.get<ManagerResponse>(`/api/users/?is_operational_manager=false`)
    }

    static patchManager(managerId:number, data:any) {
        return $api.patch(`/api/users/${managerId}/`, {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "middle_name": data.middle_name,
            "operational_manager": Number(data.operational_manager)
        })
    }
    static fetchOperationsManagers() {
        return $api.get('/api/users/?is_operational_manager=true')
    }

}