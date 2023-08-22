import {IManager} from "./ManagerResponse";

export interface Project {
    id: number
    name: string
    manager: IManager[],
    assessors_count: number,
    backlog: string,
    asana_id: number,
    speed_per_hour: number,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: number,
    status: string,
    tag: Tag[],
    date_of_creation: string
}
interface Tag {
    id: number,
    name: string
}
type Status = {
    status: "paused" | "active" | "completed"
}