import TableCheckBox from "../../UI/TableCheckBox";
import React, {useContext, useState} from "react";
import {createColumnHelper, Row} from "@tanstack/react-table";
import {NavLink} from "react-router-dom";
import {ProjectAssessor} from "../../../models/AssessorResponse";
import Sorting from "../../../utils/sorting";
import {Context} from "../../../index";


export const useProjectAssessorsColumns = () => {
    const statusObject = {
        "full": "Полная загрузка",
        "partial": "Частичная загрузка",
        "reserved": "Зарезервирован",
    }
    const [sorting, setSorting] = React.useState({
        total_working_hours: '-total_working_hours'
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
    const {store} = useContext(Context)
    const [selectedRows, setSelectedRows] = useState<Row<ProjectAssessor>[]>([])
    const columnHelper = createColumnHelper<ProjectAssessor>()
    const columns = [
        columnHelper.accessor('id', {
            header: '',
            cell: ({row}) => (
                <div className={`px-1 w-full h-full flex justify-center items-center ${((row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>
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
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}><NavLink to={`/assessor/${info.row.original.id}/`}>{info.getValue()}</NavLink></div>,
                    enableSorting: false
                }),
                columnHelper.accessor('first_name', {
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}><NavLink to={`/assessor/${info.row.original.id}/`}>{info.getValue()}</NavLink></div>,
                    header: () => <span>Имя</span>,
                    enableSorting: false
                }),
                columnHelper.accessor('middle_name', {
                            cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}><NavLink to={`/assessor/${info.row.original.id}/`}>{info.getValue()}</NavLink></div>,
                    header: () => <span>Отчество</span>,
                    enableSorting: false
                })
            ],
        }),
        columnHelper.accessor('username', {
            header: () => 'Ник в ТГ',
            cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}><a className={'text-[#102ede]'} target='_blank' href={`https://t.me/${info.getValue()}`}>{info.getValue()}</a></div>,
            enableSorting: false,
        }),
        columnHelper.group({
            header: 'Количество рабочих часов',
            columns: [
                columnHelper.accessor('working_hours', {
                    id: 'monday',
                    header: () => 'ПН',
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.working_hours.length !== 0 ? info.row.original.working_hours[0]?.monday : 0}</div>,
                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'tuesday',
                    header: () => 'ВТ',
                    enableSorting: false,
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.working_hours.length !== 0 ? info.row.original.working_hours[0]?.tuesday : 0}</div>,

                }),
                columnHelper.accessor('working_hours', {
                    id: 'wednesday',
                    header: () => 'СР',
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.working_hours.length !== 0 ? info.row.original.working_hours[0]?.wednesday : 0}</div>,

                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'thursday',
                    header: () => 'ЧТ',
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.working_hours.length !== 0 ? info.row.original.working_hours[0]?.thursday : 0}</div>,

                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'friday',
                    header: () => 'ПТ',
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.working_hours.length !== 0 ? info.row.original.working_hours[0]?.friday : 0}</div>,

                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'saturday',
                    header: () => 'СБ',
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.working_hours.length !== 0 ? info.row.original.working_hours[0]?.saturday : 0}</div>,

                    enableSorting: false
                }),
                columnHelper.accessor('working_hours', {
                    id: 'sunday',
                    header: () => 'ВС',
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.working_hours.length !== 0 ? info.row.original.working_hours[0]?.sunday : 0}</div>,
                    enableSorting: false
                }),
            ],
        }),
        columnHelper.accessor('working_hours', {
            id: 'total',
            header: () => <div className='flex'><p>Всего</p><Sorting sortingKey={"total_working_hours"} func={setSorting} sortingValue={sorting.total_working_hours} state={sorting}/></div>,
    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.working_hours.length !== 0 ? info.row.original.working_hours[0]?.total : 0}</div>,

            enableSorting: false
        }),
        columnHelper.accessor('workload_status', {
            header: () => 'Статус',
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.row.original.workload_status ? statusObject[info.getValue()[0]?.status] : ''}</div>,
            enableSorting: false
        }),
        columnHelper.accessor('skills', {
            header: () => 'Навыки',
                    cell: info => <div className={`w-full h-full flex justify-center items-center ${((info.row.original.manager.id.toString() !== store.user_id.toString()) && !store.user_data.is_teamlead) ? 'bg-red-100' : ''}`}>{info.getValue().map((skill: any) => skill.title).join(', ')}</div>,
            enableSorting: false,

        }),
    ]
    return {columns,sorting, selectedRows, getSortingString, setSelectedRows}
}