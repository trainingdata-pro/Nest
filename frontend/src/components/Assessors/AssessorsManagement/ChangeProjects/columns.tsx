import {createColumnHelper, Row} from "@tanstack/react-table";
import {Project} from "../../../../models/ProjectResponse";
import TableCheckBox from "../../../UI/TableCheckBox";
import React, {useState} from "react";

export const useChangeAssessorsColumns = () => {
    const columnHelper = createColumnHelper<Project>()
    const [selectedRows, setSelectedRows] = useState<Row<Project>[]>([])
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

    return {selectedRows, columns}
}