import React, {useState} from "react";
import TableCheckBox from "../../UI/TableCheckBox";
import {createColumnHelper} from "@tanstack/react-table";
import {Assessor} from "../../../models/AssessorResponse";
import {useNavigate} from "react-router-dom";

export const useMyAssessorsSorting = () => {
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
    const columnHelper = createColumnHelper<Assessor>()

    const stateObject = {
        "available": "Доступен",
        "busy": "Занят",
        "free_resource": "Свободный ресурс",
        "vacation": "Отпуск",
        "blacklist": "Черный список",
        "fired": "Уволен",
    }
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const navigation = useNavigate()
    const columns = [
        columnHelper.accessor('id', {
            header: ({table}) => (
                <div className="px-1">
                    <TableCheckBox selectedRows={selectedRows} type={'multi'} setSelectedRows={setSelectedRows} table={table} value={table.getPreFilteredRowModel().rows}/>
                </div>
            ),
            cell: ({row}) => (
                <div className="px-1">
                    <TableCheckBox selectedRows={selectedRows} type={'multi'} setSelectedRows={setSelectedRows} table={undefined} value={row}/>
                </div>
            ),
            enableSorting: false,
            maxSize: 30
        }),
        columnHelper.accessor('last_name', {
            header: 'Фамилия',
            cell: info =>
                <div className='w-full h-full text-center  cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            enableSorting: false,

        }),
        columnHelper.accessor('first_name', {
            cell: info =>
                <div className='w-full h-full text-center cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            header: 'Имя',
            enableSorting: false
        }),
        columnHelper.accessor('middle_name', {
            header: 'Отчество',
            cell: info =>
                <div className='w-full h-full text-center cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            enableSorting: false
        }),
        columnHelper.accessor('username', {
            header: 'Ник в ТГ',
            cell: info => info.renderValue(),
            enableSorting: false
        }),
        columnHelper.accessor('projects', {
            header: 'Проект',
            cell: info => info.row.original.projects.map(project => project.name).join(', '),
            enableSorting: false
        }),
        columnHelper.accessor('working_hours', {
            header: 'Всего рабочих часов',
            cell: info => info.row.original.working_hours.map(wh => wh.total).reduce((a, v) => a = a + v, 0),
            enableSorting: false,
            maxSize: 120
        }),
        columnHelper.accessor('state', {
            header: 'Состояние',
            cell: info => stateObject[info.row.original.state],
            enableSorting: false
        }),
        columnHelper.accessor('skills', {
            header: 'Навыки',
            cell: info => info.row.original.skills.map(skill => skill.title).join(', '),
            enableSorting: false
        }),
    ]
    return {columns,sorting, selectedRows, getSortingString, setSelectedRows}
}