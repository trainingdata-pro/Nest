import FreeResourceEdit from "./FreeResourceEdit";
import React from "react";
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
    columnHelper.accessor('last_manager', {
        header: 'Последний руководитель',
        cell: info => info.getValue(),

        enableSorting: false
    }),
    columnHelper.accessor('last_project', {
        header: 'Последний проект',
        cell: info => info.getValue(),
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