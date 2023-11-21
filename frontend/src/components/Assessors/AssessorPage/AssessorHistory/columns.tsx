import {createColumnHelper} from "@tanstack/react-table";
import {IHistory} from "../../../../models/AssessorResponse";
import React from "react";
import moment from "moment-timezone";
import {format, utcToZonedTime, zonedTimeToUtc} from "date-fns-tz";

const action = {
    'created': 'Создать исполнителя',
    'to_team': 'Забрать в команду',
    'rent': 'Арендовать',
    'add_project': 'Добавить проект',
    'remove_project': 'Удалить с проекта',
    'complete_project': 'Завершить проект',
    'left': 'Уволить',
    'unpin': 'Открепить от себя',
    'add_to_free_resource': 'Отправить в свободные ресурсы',
    'return_from_free_resource': 'Вернуть из свободных ресурсов',
    'to_vacation': 'Отправить в отпуск',
    'from_vacation': 'Вернуть из отпуска'
}
const attribute = {
    'full_name': 'ФИО',
    'username': 'Никнейм в Telegram',
    'manager': 'Руководитель',
    'project': 'Проект',
    'state': 'Состояние'
}
export const useHistoryColumns = () => {
    const columnHelper = createColumnHelper<IHistory>()
    const columns = [
        columnHelper.accessor('timestamp', {
            header: 'Время',
            cell: info => {
                const TimeZone = moment.tz.guess()
                const zonedDate = utcToZonedTime(new Date(info.getValue()), TimeZone)
                return format(zonedDate, 'dd-MM-yyyy HH:mm:ss',{ timeZone: TimeZone } )
            }
        }),
        columnHelper.accessor('attribute', {
            header: 'Аттрибут',
            cell: info => attribute[info.getValue()]
        }),
        columnHelper.accessor('old_value', {
            header: 'Старое значение',
            cell: (info) => <div className="flex flex-col justify-center bg-red-200 h-full w-full items-center text-center break-words">
                {info.getValue()?.split('; ').map(val => <p
                className='w-fit mx-auto'>{val}</p>)}</div>
        }),
        columnHelper.accessor('new_value', {
            header: 'Новое значение',
            cell: (info) => <div className="flex flex-col justify-center bg-green-200 h-full w-full items-center text-center break-words">
                {info.getValue()?.split('; ').map(val => <p
                    className='w-fit mx-auto'>{val}</p>)}</div>
        }),
        columnHelper.accessor('action', {
            header: 'Действие',
            cell: info => action[info.getValue()]
        }),
        columnHelper.accessor('reason', {
            header: 'Причина'
        }),
        columnHelper.accessor('user', {
            header: 'Пользователь',

        }),

    ]
    return {columns}
}