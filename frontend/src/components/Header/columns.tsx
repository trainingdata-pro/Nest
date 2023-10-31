import {createColumnHelper} from "@tanstack/react-table";
import {ICheckAssessor} from "../../services/AssessorService";
import React, {Dispatch} from "react";

const stateObject = {
    "available": "Доступен",
    "busy": "Занят",
    "free_resource": "Свободный ресурс",
    "vacation": "Отпуск",
    "blacklist": "Черный список",
    "fired": "Уволен",
}

export const useCheckAssessorColumns = ({setIsShowHistory, setIdToShow}: {
    setIsShowHistory: Dispatch<boolean>,
    setIdToShow: Dispatch<number>
}) => {
    const columnHelper = createColumnHelper<ICheckAssessor>()
    const columns = [
        columnHelper.accessor('last_name', {
            header: 'Фамилия',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('first_name', {
            cell: info => info.getValue(),
            header: 'Имя',
            enableSorting: false
        }),
        columnHelper.accessor('middle_name', {
            header: 'Отчество',
            cell: info =>info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('username', {
            header: 'Ник в ТГ',
            cell: info => info.renderValue(),
            enableSorting: false
        }),
        columnHelper.accessor('projects', {
            header: 'Проект',
            cell: info => {
                if (info.row.original.last_project){
                    return info.row.original.last_project
                } else {
                    return info.row.original.projects?.map(project => project.name).join(', ')
                }
            },
            enableSorting: false
        }),
        columnHelper.accessor('manager', {
            header: 'Менеджер',
            cell: info => {
                if (info.row.original.last_manager){
                    return info.row.original.last_manager
                } else if (info.row.original.manager) {
                    return `${info.row.original.manager.last_name} ${info.row.original.manager.first_name}`
                } else {
                    return ''
                }

            },
            enableSorting: false
        }),
        columnHelper.accessor('state', {
            header: 'Состояние',
            cell: info => stateObject[info.row.original.state],
            enableSorting: false
        }),
        columnHelper.display( {
            id: 'assessorId',
            header: '',
            cell: info => <>
                <div className='cursor-pointer' onClick={() => {
                    setIdToShow(info.row.original.pk)
                    setIsShowHistory(true)
                }}>История</div>
            </>,
            enableSorting:false
        })
    ]
    return {columns}
}