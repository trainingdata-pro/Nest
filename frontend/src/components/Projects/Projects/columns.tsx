import {createColumnHelper} from "@tanstack/react-table";
import {Project} from "../../../models/ProjectResponse";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Sorting from "../../FreeResource/FreeResorces/sorting";


export const useProjectsSorting =()=> {
    const [sorting, setSorting] = React.useState({
        status: 'status',
        assessors_count: '-assessors_count',
    })
    const columnHelper = createColumnHelper<Project>()
    const [projectsId, setProjectId] = useState(0)
    const [showSidebar, setShowSidebar] = useState(false)
    const statusObject = {
        "active": "Активный",
        "pause": "На паузе",
        "completed": "Завершенный"
    }
    const getSortingString = () => {
        return Object.keys(sorting).filter(key => {
            // @ts-ignore
            return sorting[key] !== ''
        }).map(key => {
            // @ts-ignore
            return sorting[key]
        }).join(',')
    }
    const navigation = useNavigate()
    const columns = [
        columnHelper.accessor('asana_id', {
            header: 'Asana ID',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('name', {
            cell: info => <div className="cursor-pointer h-full w-full text-center break-all" onClick={() => {
                setProjectId(info.row.original.id)
                setShowSidebar(true)
            }}><p className='hover:border-b hover:border-black w-fit mx-auto'>{info.getValue()}</p></div>,
            header: 'Название',
            enableSorting: false
        }),
        columnHelper.accessor('manager', {
            header: 'Менеджер',
            cell: info => <div className='flex flex-col'>{info.getValue().map(manager => <div key={manager.id}>{`${manager.last_name} ${manager.first_name}`}</div>)}</div>,
            enableSorting: false
        }),
        columnHelper.accessor('assessors_count', {
            header: () => <div className='flex'><p>Количество ассессеров</p><Sorting sortingKey={"assessors_count"} func={setSorting} sortingValue={sorting.assessors_count} state={sorting}/></div>,
            cell: info => <div className="cursor-pointer h-full w-full text-center break-all"
                               onClick={() => navigation(`/projects/${info.row.original.id}/assessors/?name=${info.row.original.name}`)}><p className='hover:border-b border-black w-fit mx-auto'>{info.getValue()}</p></div>,
            enableSorting: true
        }),
        columnHelper.accessor('status', {
            header: () => <div className='flex'><p>Статус</p><Sorting sortingKey={"status"} func={setSorting} sortingValue={sorting.status} state={sorting}/></div>,
            cell: ({row}) => statusObject[row.original.status],
            enableSorting: true
        })
    ]

    return {getSortingString,projectsId, sorting, setShowSidebar, setProjectId, columns, showSidebar}
}