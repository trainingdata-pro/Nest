import {IManager, IUser} from "./ManagerResponse";

export interface ServerResponse<T> {
    count: number
    next: any
    previous: any
    page: number
    page_size: number
    results: T[]
}
export interface ProjectResponse {
    count: number,
    next: string | null,
    results: Project[]
}
export interface Tag {
    id: number,
    name: string,
}
export interface TagResult {
    results: Tag[]
}

export type ProjectFormProps = {
    name: string,
    asana_id: number | string,
    manager: number[]
    speed_per_hour: number | string,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: string,
    status: string,
    tag: number[] | string[],
    date_of_creation: string
}
export interface Project {
    id: number
    name: string
    manager: IUser[],
    assessors_count: number,
    asana_id: number,
    speed_per_hour: number,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: string,
    status: Status,
    tag: Tag[],
    date_of_creation: string,
    date_of_completion: string,
}

type Status = "pause" | "active" | "completed"
