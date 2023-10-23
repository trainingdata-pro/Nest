import {createColumnHelper} from "@tanstack/react-table";
import {Project} from "../../../../models/ProjectResponse";
import TableCheckBox from "../../../UI/TableCheckBox";
import React from "react";

const columnHelper = createColumnHelper<Project>()
export const columns = [
    columnHelper.accessor('id', {
        header: ({ table }) => (
            <TableCheckBox
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
        cell: ({ row }) => (
            <div className="px-1">
                <TableCheckBox
                    {...{
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
            </div>
        ),
        enableSorting: false,
        maxSize: 30
    }),
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
    columnHelper.accessor('assessors_count', {
        header: 'Количество ассессеров',
        cell: info => info.getValue(),
        enableSorting: false
    })
]