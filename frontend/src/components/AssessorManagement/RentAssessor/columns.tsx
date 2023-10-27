import {createColumnHelper, Row} from "@tanstack/react-table";
import {Project} from "../../../models/ProjectResponse";
import TableCheckBox from "../../UI/TableCheckBox";
import React, {useState} from "react";


export const useRentAssessorColumns = () => {
    const columnHelperT = createColumnHelper<Project>()
    const [selectedRows, setSelectedRows] = useState<Row<Project>[]>([])
    const columns = [
        columnHelperT.accessor('id', {
            cell: ({row}) => (
                <div className="px-1">
                    <TableCheckBox selectedRows={selectedRows} type={'single'} setSelectedRows={setSelectedRows} table={undefined} value={row}/>
                </div>
            ),
            header: '',
            enableSorting: false,
            maxSize: 30
        }),
        columnHelperT.accessor('asana_id', {
            header: 'Asana ID',
            cell: info => info.getValue(),
            enableSorting: false,

        }),
        columnHelperT.accessor('name', {
            cell: info => info.getValue(),
            header: 'Название',
            enableSorting: false
        }),
        columnHelperT.accessor('assessors_count', {
            header: 'Количество ассессеров',
            cell: info => info.getValue(),
            enableSorting: false
        })
    ]
    return {selectedRows, columns}
}
