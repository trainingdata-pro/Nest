import TableCheckBox from "../../UI/TableCheckBox";
import React from "react";
import {createColumnHelper} from "@tanstack/react-table";
import {NavLink} from "react-router-dom";
import {ProjectAssessors} from "../../../models/AssessorResponse";

const statusObject = {
    "full": "Полная загрузка",
    "partial": "Частичная загрузка",
    "reserved": "Зарезервирован",
}

const columnHelper = createColumnHelper<ProjectAssessors>()
export const columns = [
    // columnHelper.accessor('id', {
    //     header: ({table}) => (
    //         <TableCheckBox
    //             {...{
    //                 checked: table.getIsAllRowsSelected(),
    //                 indeterminate: table.getIsSomeRowsSelected(),
    //                 onChange: table.getToggleAllRowsSelectedHandler(),
    //             }}
    //         />
    //     ),
    //     cell: ({row}) => (
    //         <div className="px-1">
    //             <TableCheckBox
    //                 {...{
    //                     checked: row.getIsSelected(),
    //                     disabled: !row.getCanSelect(),
    //                     indeterminate: row.getIsSomeSelected(),
    //                     onChange: row.getToggleSelectedHandler(),
    //                 }}
    //             />
    //         </div>
    //     ),
    //     enableSorting: false,
    //     maxSize: 30
    // }),
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
            columnHelper.accessor('working_hours.monday', {
                header: () => 'ПН',
                cell: info => info.row.original.working_hours ? info.getValue() : 0,
                enableSorting: false
            }),
            columnHelper.accessor('working_hours.tuesday', {
                header: () => 'ВТ',
                enableSorting: false,
                cell: info => info.row.original.working_hours ? info.getValue() : 0,

            }),
            columnHelper.accessor('working_hours.wednesday', {
                header: () => 'СР',
                cell: info => info.row.original.working_hours ? info.getValue() : 0,

                enableSorting: false
            }),
            columnHelper.accessor('working_hours.thursday', {
                header: () => 'ЧТ',
                cell: info => info.row.original.working_hours ? info.getValue() : 0,

                enableSorting: false
            }),
            columnHelper.accessor('working_hours.friday', {
                header: () => 'ПТ',
                cell: info => info.row.original.working_hours ? info.getValue() : 0,

                enableSorting: false
            }),
            columnHelper.accessor('working_hours.saturday', {
                header: () => 'СБ',
                cell: info => info.row.original.working_hours ? info.getValue() : 0,

                enableSorting: false
            }),
            columnHelper.accessor('working_hours.sunday', {
                header: () => 'ВС',
                cell: info => info.row.original.working_hours ? info.getValue() : 0,
                enableSorting: false
            }),
        ],
    }),
    columnHelper.accessor('working_hours.total', {
        header: () => 'Всего',
        cell: info => info.row.original.working_hours ? info.getValue() : 0,

        enableSorting: false
    }),
    columnHelper.accessor('workload_status', {
        header: () => 'Статус',
        cell: info => info.row.original.workload_status ? statusObject[info.getValue()] : '',
        enableSorting: false
    }),
    columnHelper.accessor('skills', {
        header: () => 'Навыки',
        cell: info => info.getValue().map((skill: any) => skill.title).join(', '),
        enableSorting: false,

    }),
]