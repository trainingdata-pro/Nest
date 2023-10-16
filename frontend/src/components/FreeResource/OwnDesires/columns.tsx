import React from "react";
import {createColumnHelper} from "@tanstack/react-table";

import {NavLink} from "react-router-dom";
import LastManager from "../FreeResorces/LastManager";
import LastProject from "../FreeResorces/LastProject";
import {IFired} from "../../../models/AssessorResponse";
export interface FiredAssessor extends IFired {
    last_manager: string,
    last_project: string
}
const columnHelper = createColumnHelper<FiredAssessor>()


export const columns = [
    columnHelper.accessor('assessor.last_name', {
        header: 'Фамилия',
        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
        enableSorting: false,
    }),
    columnHelper.accessor('assessor.first_name', {
        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
        header: 'Имя',
        enableSorting: false
    }),
    columnHelper.accessor('assessor.middle_name', {
        header: 'Отчество',
        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
        enableSorting: false
    }),
    columnHelper.accessor('assessor.username', {
        header: 'Ник в ТГ',
        cell: info => info.renderValue(),
        enableSorting: false
    }),
    columnHelper.accessor('last_manager', {
        header: 'Последний руководитель',
        cell: info => <LastManager assessorId={info.row.original.id}/>,
        enableSorting: false
    }),
    columnHelper.accessor('last_project', {
        header: 'Последний проект',
        cell: info => <LastProject assessorId={info.row.original.id}/>,
        enableSorting: false
    }),
    columnHelper.accessor('reason.title', {
        header: 'Причина увольнения',
        cell: info => info.getValue(),
        enableSorting: false
    }),
    columnHelper.accessor('assessor.skills', {
        header: 'Навыки',
        cell: info => <div className='flex flex-col'>{info.getValue().map((skill: any) => <span key={skill.id}>{skill.title}</span>)}</div>,
        enableSorting: false
    }),
    columnHelper.accessor('date', {
        header: 'Дата ухода',
        cell: info => info.getValue(),
        enableSorting:false
    }),
    columnHelper.accessor('possible_return_date', {
        header: 'Предполагаемая дата возращения',
        cell: info => info.getValue(),
        enableSorting:false
    })
]