import React from "react";
import {createColumnHelper} from "@tanstack/react-table";
import OwnDesiresEdit from "./OwnDesiresEdit";
import Sorting from "../FreeResorces/sorting";
import {FiredAssessor} from "../../../models/AssessorResponse";

export const useOwnDesiresSorting = () => {
    const [sorting, setSorting] = React.useState({
        manager__last_name: '',
        projects: '',
        last_name: 'last_name'
    })
    const getSortingString = () => {
        return Object.keys(sorting).filter(key => {
            // @ts-ignore
            return sorting[key] !== ''
        }).map(key => {
            // @ts-ignore
            return sorting[key]
        }).join(',')
    }
    const columnHelper = createColumnHelper<FiredAssessor>()
    const columns = [
        columnHelper.accessor('assessor.last_name', {
            header: 'Фамилия',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('assessor.first_name', {
            header: 'Имя',
            enableSorting: false,
            cell: info => info.getValue(),

        }),
        columnHelper.accessor('assessor.middle_name', {
            header: 'Отчество',
            enableSorting: false,
            cell: info => info.getValue(),

        }),
        columnHelper.accessor('assessor.username', {
            header: 'Ник в ТГ',
            cell: info => info.renderValue(),
            enableSorting: false
        }),
        columnHelper.accessor('last_manager', {
            header: () => <div className='flex'><p>Последний руководитель</p><Sorting state={sorting} func={setSorting} sortingKey={'manager__last_name'} sortingValue={sorting.manager__last_name}/></div>,
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('last_project', {
            header: () => <div className='flex'><p>Последний проект</p><Sorting state={sorting} func={setSorting} sortingKey={'projects'} sortingValue={sorting.projects}/></div>,
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('reason.title', {
            header: 'Причина увольнения',
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('assessor.skills', {
            header: 'Навыки',
            cell: info => <div className='flex flex-col'>{info.getValue()?.map((skill: any) => <span
                key={skill.id}>{skill.title}</span>)}</div>,
            enableSorting: false
        }),
        columnHelper.accessor('date', {
            header: 'Дата ухода',
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('possible_return_date', {
            header: 'Предполагаемая дата возращения',
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('id', {
            header: '',
            cell: info => <OwnDesiresEdit assessor={info.row.original}/>,
            enableSorting: false
        })
    ]
    return {columns, sorting, getSortingString}
}