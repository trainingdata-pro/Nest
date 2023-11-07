import React, {useState} from "react";
import TableCheckBox from "../../UI/TableCheckBox";
import {createColumnHelper, Row} from "@tanstack/react-table";
import {Assessor} from "../../../models/AssessorResponse";
import {useNavigate} from "react-router-dom";
import Sorting from "../../FreeResource/FreeResorces/sorting";

export const useMyAssessorsSorting = () => {
    const [sorting, setSorting] = React.useState({
        manager__last_name: '',
        projects: '',
        username: '',
        total_working_hours: '-total_working_hours',
        last_name: '-last_name',
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
    const [selectedRows, setSelectedRows] = useState<Row<Assessor>[]>([])
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
            header: () => <div className='flex'><p>Фамилия</p><Sorting sortingKey={"last_name"} func={setSorting} sortingValue={sorting.last_name} state={sorting}/></div>,
            cell: info =>
                <div className='text-center cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            enableSorting: false,

        }),
        columnHelper.accessor('first_name', {
            cell: info =>
                <div className='text-center cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            header: 'Имя',
            enableSorting: false
        }),
        columnHelper.accessor('middle_name', {
            header: 'Отчество',
            cell: info =>
                <div className='text-center cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            enableSorting: false
        }),
        columnHelper.accessor('username', {
            header: 'Ник в ТГ',
            cell: info => <a className={'text-[#102ede]'} href={`https://t.me/${info.getValue()}`}>{info.getValue()}</a>,
            enableSorting: false
        }),
        columnHelper.accessor('projects', {
            header: 'Проект',
            cell: info => info.row.original.projects.map(project => project.name).join(', '),
            enableSorting: false
        }),
        columnHelper.accessor('working_hours', {
            header: () => <div className='flex'><p>Всего рабочих часов</p><Sorting sortingKey={"total_working_hours"} func={setSorting} sortingValue={sorting.total_working_hours} state={sorting}/></div>,
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