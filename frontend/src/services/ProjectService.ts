import {AxiosResponse} from "axios";
import $api from "../http";
import {ManagerData} from "../store/store";

export interface Project {
    id: number,
    manager: ManagerData,
    assessors_count: number,
    backlog: string,
    name: string,
    speed_per_hour: number,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: number,
    status: [],
    date_of_creation: string,
    asana_id: number

}

interface ProjectResponse {
    results: Project[]
}

export default class ProjectService {
    static fetchProjects(id: number): any {
        return $api.get<ProjectResponse>(`/api/projects/?manager=${id}`)
    }

    // static addProject(project_id: number, data: Project): Promise<AxiosResponse<Project>> {
    //     return $api.post<Project>(`/api/projects/${project_id}/`, data)
    // }
    static addProject(data: any): Promise<AxiosResponse<Project>> {
        // @ts-ignore
        console.log(data.manager.map(managerId => managerId.value))
        return $api.post<Project>(`/api/projects/`, {

            // @ts-ignore
            "manager": data.manager.map(managerId => managerId["value"]),
            "assessors_count": data.assessors_count,
            "backlog": data.backlog,
            "name": data.name,
            "speed_per_hour":data.speed_per_hour,
            "price_for_assessor":data.price_for_assessor,
            "price_for_costumer": data.price_for_costumer,
            "unloading_value": data.unloading_value,
            "unloading_regularity": data.unloading_regularity,
            "status": data.status,
            "date_of_creation": data.date_of_creation,
            "asana_id": data.asana_id
        })

    }
}