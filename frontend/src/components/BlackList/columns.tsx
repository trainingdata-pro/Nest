import {NavLink} from "react-router-dom";
import React from "react";
import {createColumnHelper} from "@tanstack/react-table";
import {IBlackList} from "../../models/AssessorResponse";
import BlackListEdit from "./BlackListEdit";
import Sorting from "../FreeResource/FreeResorces/sorting";


export const useBlacklistColumns = () => {
    const columnHelper = createColumnHelper<IBlackList>()
    const [sorting, setSorting] = React.useState({
        last_project: '',
        last_manager: 'last_manager'
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

    const columns = [
        columnHelper.accessor('assessor.last_name', {
            header: 'Фамилия',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('assessor.first_name', {
            cell: info => info.getValue(),
            header: 'Имя',
            enableSorting: false
        }),
        columnHelper.accessor('assessor.middle_name', {
            header: 'Отчество',
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('assessor.username', {
            header: 'Ник в ТГ',
            cell: info => <a className={'text-[#102ede]'} href={`https://t.me/${info.getValue()}`} target='_blank'>{info.getValue()}</a>,
            enableSorting: false
        }),
        columnHelper.accessor('last_manager', {
            header: () => <div className='flex'><p>Последний руководитель</p><Sorting sortingKey={"last_manager"} func={setSorting} sortingValue={sorting.last_manager} state={sorting}/></div>,
            cell: info => info.renderValue(),
            enableSorting: false
        }),
        columnHelper.accessor('last_project', {
            header: () => <div className='flex'><p>Последний проект</p><Sorting sortingKey={"last_project"} func={setSorting} sortingValue={sorting.last_project} state={sorting}/></div>,
            cell: info => info.renderValue(),
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
            enableSorting: false
        })]

    return {columns, sorting, getSortingString}
}

