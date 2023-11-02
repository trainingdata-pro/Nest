import TableCheckBox from "../../UI/TableCheckBox";
import React, {useState} from "react";
import {createColumnHelper, Row} from "@tanstack/react-table";
import {NavLink} from "react-router-dom";
import {ProjectAssessor} from "../../../models/AssessorResponse";
import Sorting from "../../FreeResource/FreeResorces/sorting";


export const useProjectAssessorsColumns = () => {
    const statusObject = {
        "full": "Полная загрузка",
        "partial": "Частичная загрузка",
        "reserved": "Зарезервирован",
    }
    const [sorting, setSorting] = React.useState({
        manager__last_name: '',
        projects: '',
        username: '',
        total_working_hours: 'total_working_hours'
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

    const [selectedRows, setSelectedRows] = useState<Row<ProjectAssessor>[]>([])
    const columnHelper = createColumnHelper<ProjectAssessor>()
    const columns = [
        columnHelper.accessor('id', {
            header: '',
            cell: ({row}) => (
                <div className="px-1">
                    <TableCheckBox selectedRows={selectedRows} type={'multi'} setSelectedRows={setSelectedRows} table={undefined} value={row}/>
                </div>
            ),
            enableSorting: false,
            maxSize: 30
        }),
        columnHelper.group({
            header: 'ФИО',
            columns: [
                columnHelper.accessor('last_name', {
                    header: () => <span>Фамилия</span>,
                    cell: info => <NavLink to={`/assessor/${info.row.original.id}/`}>{info.getValue()}</NavLink>,
                    enableSorting: false
                }),
                columnHelper.accessor('first_name', {
                    cell: info => <NavLink to={`/assessor/${info.row.original.id}/`}>{info.getValue()}</NavLink>,
                    header: () => <span>Имя</span>,
                    enableSorting: false
                }),
                columnHelper.accessor('middle_name', {
                    cell: info => <NavLink to={`/assessor/${info.row.original.id}/`}>{info.getValue()}</NavLink>,
                    header: () => <span>Отчество</span>,
                    enableSorting: false
                })
            ],
        }),
        columnHelper.accessor('username', {
            header: () => 'Ник в ТГ',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.group({
            header: 'Количество рабочих часов',
            columns: [
                columnHelper.accessor('working_hours', {
                    id: 'monday',
                    header: () => 'ПН',
                    cell: info => info.row.original.working_hours.length !==0 ? info.row.original.working_hours[0]?.monday : 0,
                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'tuesday',
                    header: () => 'ВТ',
                    enableSorting: false,
                    cell: info => info.row.original.working_hours.length !==0 ? info.row.original.working_hours[0]?.tuesday : 0,

                }),
                columnHelper.accessor('working_hours', {
                    id: 'wednesday',
                    header: () => 'СР',
                    cell: info => info.row.original.working_hours.length !==0 ? info.row.original.working_hours[0]?.wednesday : 0,

                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'thursday',
                    header: () => 'ЧТ',
                    cell: info => info.row.original.working_hours.length !==0 ? info.row.original.working_hours[0]?.thursday : 0,

                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'friday',
                    header: () => 'ПТ',
                    cell: info => info.row.original.working_hours.length !==0 ? info.row.original.working_hours[0]?.friday : 0,

                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'saturday',
                    header: () => 'СБ',
                    cell: info => info.row.original.working_hours.length !==0 ? info.row.original.working_hours[0]?.saturday : 0,

                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'sunday',
                    header: () => 'ВС',
                    cell: info => info.row.original.working_hours.length !==0 ? info.row.original.working_hours[0]?.sunday : 0,
                    enableSorting: false
                }),
            ],
        }),
        columnHelper.accessor('working_hours', {
            id: 'total',
            header: () => <div className='flex'><p>Всего</p><Sorting sortingKey={"total_working_hours"} func={setSorting} sortingValue={sorting.total_working_hours} state={sorting}/></div>,
            cell: info => info.row.original.working_hours.length !==0 ?info.row.original.working_hours[0]?.total : 0,

            enableSorting: false
        }),
        columnHelper.accessor('workload_status', {
            header: () => 'Статус',
            cell: info => info.row.original.workload_status ? statusObject[info.getValue()[0]?.status] : '',
            enableSorting: false
        }),
        columnHelper.accessor('skills', {
            header: () => 'Навыки',
            cell: info => info.getValue().map((skill: any) => skill.title).join(', '),
            enableSorting: false,

        }),
    ]
    return {columns,sorting, selectedRows, getSortingString, setSelectedRows}
}