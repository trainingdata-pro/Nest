import FreeResourceEdit from "./FreeResourceEdit";
import {createColumnHelper} from "@tanstack/react-table";
import {FreeAssessor} from "./FreeResource";
import React from "react";
import Sorting from "../../../utils/sorting";

export const useFreeResourcesSorting = () => {
    const [sorting, setSorting] = React.useState({
        manager__last_name: '',
        projects: '',
        username: '',
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
    const columnHelper = createColumnHelper<FreeAssessor>()
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
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('username', {
            header: () => 'Ник в ТГ',
            cell: info => <a className={'text-[#102ede]'} target='_blank' href={`https://t.me/${info.getValue()}`}>{info.getValue()}</a>,
            enableSorting: false
        }),
        columnHelper.accessor('manager', {
            header: () => <div className='flex'><p>Руководитель</p><Sorting state={sorting} func={setSorting} sortingKey={'manager__last_name'} sortingValue={sorting.manager__last_name}/></div>,
            cell: info => {
                if (info.getValue()){
                    return `${info.getValue().last_name} ${info.getValue().first_name}`
                } else {
                    return ''
                }
            },
            enableSorting: false
        }),
        columnHelper.accessor('projects', {
            header: () => <div className='flex'><p>Проект</p><Sorting state={sorting} func={setSorting} sortingKey={'projects'} sortingValue={sorting.projects}/></div>,
            cell: info => <div className='flex flex-col'>{info.getValue().map(project => <span key={project.id}>{project.name}</span>)}</div>,
            enableSorting: false
        }),
        columnHelper.accessor('free_resource_weekday_hours', {
            header: 'Кол-во рабочих часов (будние)',
            cell: info => info.renderValue(),
            enableSorting: false
        }),
        columnHelper.accessor('free_resource_day_off_hours', {
            header: 'Кол-во рабочих часов (выходные)',
            cell: info => info.renderValue(),
            enableSorting: false
        }),
        columnHelper.accessor('skills', {
            header: 'Навыки',
            cell: info => <div className='flex flex-col'>{info.getValue().map((skill: any) => <span key={skill.id}>{skill.title}</span>)}</div>,
            enableSorting: false
        }),
        columnHelper.display( {
            id: 'assessorId',
            header: '',
            cell: info => <FreeResourceEdit assessor={info.row.original}/>,
            enableSorting:false
        })
    ]
    return {columns,sorting, getSortingString}
}