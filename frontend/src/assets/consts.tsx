import {AxiosError} from "axios";

export const COUNTRIES: string[] = [
    "РФ",
    "РБ",
    "ПМР",
    "Другое"
]

export const PROJECT_STATUS = {
    "active": "Активный",
    "pause": "На паузе",
    "completed": "Завершенный"
}
export const REMOVE_FROM_PROJECTS_REASONS = [
    {
        id: 'reason1',
        value: 'Не смог работать со спецификой проекта',
        name: 'reason',
        label: 'Не смог работать со спецификой проекта'
    },
    {
        id: 'reason2',
        value: 'Не сработались',
        name: 'reason',
        label: 'Не сработались'
    },
    {
        id: 'reason3',
        value: 'Не понадобился',
        name: 'reason',
        label: 'Не понадобился'
    },
    {
        id: 'reason4',
        value: 'Усиление другого проекта',
        name: 'reason',
        label: 'Усиление другого проекта'
    }
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