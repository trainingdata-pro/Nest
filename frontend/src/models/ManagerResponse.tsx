
export interface IUser {
    id: number,
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string
    email: string,
    status: string
}

export interface IManager extends IUser{
    teamlead: IUser,
    is_teamlead: boolean
}