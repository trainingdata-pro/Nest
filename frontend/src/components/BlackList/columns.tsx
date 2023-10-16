import {NavLink} from "react-router-dom";
import LastManager from "../FreeResource/FreeResorces/LastManager";
import LastProject from "../FreeResource/FreeResorces/LastProject";
import FreeResourceEdit from "../FreeResource/FreeResorces/FreeResourceEdit";
import React from "react";
import {createColumnHelper} from "@tanstack/react-table";
import {IBlackList} from "../../models/AssessorResponse";
import BlackListEdit from "./BlackListEdit";

const columnHelper = createColumnHelper<IBlackList>()
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
        header: 'Причина',
        cell: info => info.renderValue(),
        enableSorting: false
    }),
    columnHelper.accessor('id', {
        header: '',
        cell: info => <BlackListEdit assessor={info.row.original}/>,
        enableSorting:false
    })
]