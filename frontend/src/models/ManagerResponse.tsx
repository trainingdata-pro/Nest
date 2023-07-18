
interface IUser {
    id: number,
    username: string,
    email: string
}
export interface IManager {
    id: number,
    user: IUser,
    last_name: string,
    first_name: string,
    middle_name: string,
    is_operational_manager: boolean,
    operational_manager: number

}