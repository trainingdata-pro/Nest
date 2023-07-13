import {IManager} from "./ManagerResponse";
import {IProject} from "./ProjectResponse";

export interface IAssessor {
    id: number,
    manager: IManager,
    projects: IProject[],
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string,
    is_busy: boolean,
    date_of_registration: string
}