import {AxiosError} from "axios";

export const COUNTRIES: string[] = [
    "РФ",
    "РБ",
    "ПМР",
    "Другое"
]

export const ASSESSOR_INFO_ERRORS = {
    last_name: 'Фамилия',
    first_name: 'Имя',
    middle_name: 'Отчество',
    manager: 'Менеджер',
    username: 'Ник в ТГ',
    email: 'Почта',
    country: 'Страна'
}
export const ASSESSOR_PROJECTS_ERRORS = {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Честверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
    status: 'Статус'
}
export const FREE_RESOURCE_REASONS  = {
    free_time: 'Есть свободное время',
    project_reduction: 'Сокращение проекта',
    project_mismatch: 'Не подходит текущему проекту'
}
export type T = AxiosError<typeof ASSESSOR_INFO_ERRORS> | AxiosError<typeof ASSESSOR_PROJECTS_ERRORS>