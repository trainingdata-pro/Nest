import {createColumnHelper} from "@tanstack/react-table";
import {Project} from "../../../models/ProjectResponse";
import React, {Dispatch, useContext} from "react";
import {Context} from "../../../index";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import Sorting from "../../FreeResource/FreeResorces/sorting";


export const useCompletedProjectsColumns = ({setProjectId, setShowSidebar}: {
    setProjectId: Dispatch<number>,
    setShowSidebar: Dispatch<boolean>
}) => {
    const columnHelper = createColumnHelper<Project>()
    const [sorting, setSorting] = React.useState({
        date_of_creation: '',
        date_of_completion: '-date_of_completion',
    })
    const {store} = useContext(Context)
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
        columnHelper.accessor('asana_id', {
            header: 'Asana ID',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: 'Название',
            enableSorting: false
        }),
        columnHelper.accessor('manager', {
            header: 'Менеджер',
            cell: info => info.getValue().map(manager => {
                return `${manager.last_name} ${manager.first_name}`
            }),
            enableSorting: false
        }),
        columnHelper.accessor('assessors_count', {
            header: 'Количество асессеров',
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('date_of_creation', {
            header: () => <div className='flex'><p>Дата начала</p><Sorting sortingKey={"date_of_creation"} func={setSorting} sortingValue={sorting.date_of_creation} state={sorting}/></div>,
            cell: info => info.getValue(),
            enableSorting: true
        }),
        columnHelper.accessor('date_of_completion', {
            header: () => <div className='flex'><p>Дата завершения</p><Sorting sortingKey={"date_of_completion"} func={setSorting} sortingValue={sorting.date_of_completion} state={sorting}/></div>,
            cell: info => info.getValue(),
            enableSorting: true
        }),
        columnHelper.accessor('id', {
            header: '',
            cell: (info) => <>

                <button className='disabled:opacity-50 disabled:cursor-default' onClick={() => {
                    setProjectId(info.row.original.id)
                    setShowSidebar(true)
                }}
                        disabled={!store.user_data.is_teamlead}><PencilSquareIcon
                    className="h-6 w-6 text-gray-500"/></button>
            </>,
            enableSorting: false,
            size:40
        }),
    ]
    return {sorting, getSortingString, columns}
}