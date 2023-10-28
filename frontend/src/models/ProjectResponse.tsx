import {IManager, IUser} from "./ManagerResponse";


export type ProjectFormProps = {
    name: string,
    asana_id: number | string,
    manager: number[]
    speed_per_hour: number | string,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: string,
    status: string | undefined,
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
interface Tag {
    id: number,
    name: string
}
type Status = "pause" | "active" | "completed"
