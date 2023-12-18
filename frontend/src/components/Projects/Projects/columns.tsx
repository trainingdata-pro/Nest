import {createColumnHelper} from "@tanstack/react-table";
import {Project} from "../../../models/ProjectResponse";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Sorting from "../../../utils/sorting";
import {PROJECT_STATUS} from "../../../assets/consts";


export const useProjectsSorting = ()=> {
    const [sorting, setSorting] = React.useState({
        status: 'status',
        assessors_count: '-assessors_count',
        manager__last_name: ''
    })

    const columnHelper = createColumnHelper<Project>()
    const [projectId, setProjectId] = useState(0)
    const [showSidebar, setShowSidebar] = useState(false)

    const sortingString =  Object.keys(sorting)
        .filter(key => {
            return sorting[key as keyof typeof sorting] !== ''
        }).map(key => {
            return sorting[key as keyof typeof sorting]
        }).join(',')
    const navigation = useNavigate()
    const columns = [
        columnHelper.accessor('asana_id', {
            header: 'Asana ID',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('name', {
            cell: info => <div className="cursor-pointer h-full w-full text-center break-words text-[#102ede] font-bold" onClick={() => {
                setProjectId(info.row.original.id)
                setShowSidebar(true)
            }}><p className='w-fit mx-auto'>{info.getValue()}</p></div>,
            header: 'Название',
            enableSorting: false
        }),
        columnHelper.accessor('manager', {
            header:() => <div className='flex'><p>Менеджер</p><Sorting sortingKey={"manager__last_name"} func={setSorting} sortingValue={sorting.manager__last_name} state={sorting}/></div>,
            cell: info => <div className='flex flex-col'>{info.getValue().map(manager => <div key={manager.id}>{`${manager.last_name} ${manager.first_name}`}</div>)}</div>,
            enableSorting: false
        }),
        columnHelper.accessor('assessors_count', {
            header: () => <div className='flex'><p>Количество ассессеров</p><Sorting sortingKey={"assessors_count"} func={setSorting} sortingValue={sorting.assessors_count} state={sorting}/></div>,
            cell: info => <div className="text-[#102ede] font-bold h-full w-full text-center cursor-pointer"
                               onClick={() => navigation(`/projects/${info.row.original.id}/`)}><p className='w-fit mx-auto'>{info.getValue()}</p></div>,
            enableSorting: true
        }),
        columnHelper.accessor('status', {
            header: () => <div className='flex'><p>Статус</p><Sorting sortingKey={"status"} func={setSorting} sortingValue={sorting.status} state={sorting}/></div>,
            cell: ({row}) => PROJECT_STATUS[row.original.status],
            enableSorting: true
        })
    ]

    return {sortingString,projectId, sorting, setShowSidebar, setProjectId, columns, showSidebar}
}