import FreeResourceEdit from "./FreeResourceEdit";
import {createColumnHelper} from "@tanstack/react-table";
import {FreeAssessor} from "./FreeResource";
import {NavLink} from "react-router-dom";
const columnHelper = createColumnHelper<FreeAssessor>()


export const columns = [
    columnHelper.accessor('last_name', {
        header: 'Фамилия',
        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
        enableSorting: false,
    }),
    columnHelper.accessor('first_name', {
        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
        header: 'Имя',
        enableSorting: false
    }),
    columnHelper.accessor('middle_name', {
        header: 'Отчество',
        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
        enableSorting: false
    }),
    columnHelper.accessor('username', {
        header: 'Ник в ТГ',
        cell: info => info.renderValue(),
        enableSorting: false
    }),
    columnHelper.accessor('manager', {
        header: 'Руководитель',
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
        header: 'Проект',
        cell: info => <div className='flex flex-col'>{info.getValue().map(project => <span>{project.name}</span>)}</div>,
        enableSorting: false
    }),
    columnHelper.accessor('free_resource_weekday_hours', {
        header: 'Кол-во рабочих часов(Будние)',
        cell: info => info.renderValue(),
        enableSorting: false
    }),
    columnHelper.accessor('free_resource_day_off_hours', {
        header: 'Кол-во рабочих часов(выходные)',
        cell: info => info.renderValue(),
        enableSorting: false
    }),
    columnHelper.accessor('skills', {
        header: 'Навыки',
        cell: info => <div className='flex flex-col'>{info.getValue().map((skill: any) => <span key={skill.id}>{skill.title}</span>)}</div>,
        enableSorting: false
    }),
    columnHelper.accessor('id', {
        header: '',
        cell: info => <FreeResourceEdit assessor={info.row.original}/>,
        enableSorting:false
    })
]