import {IManager} from "./ManagerResponse";
import {Project} from "./ProjectResponse";

interface Skill {
    id: number,
    title: string
}

export interface Assessor {
    id: number,
    manager: IManager,
    projects: Project[],
    skills: Skill[],
    second_manager: IManager[],
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string,
    status: string,
    is_free_resource: boolean,
    blacklist: boolean,
    date_of_registration: string,
    working_hours: AssessorWorkingTime


}

interface AssessorWorkingTime {
    id: number,
    monday: number,
    tuesday: number,
    wednesday: number,
    thursday: number,
    friday: number,
    saturday: number,
    sunday: number
}

export interface AssessorResponse {
    results: Assessor[]
}