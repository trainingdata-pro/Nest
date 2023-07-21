export interface IProject {
    id: number,
    name: string,
    date_of_create: string
}


export interface Project {
    id: number
    name: string
    owner: {
        id: number,
        user: {
            id: number,
            username: string,
            email: string
        },
        last_name: string,
        first_name: string,
        middle_name: string,
    },
    assessors_count: number,
    date_of_create: string
}