import {createColumnHelper} from "@tanstack/react-table";
import {Project} from "../../../models/ProjectResponse";
import TableCheckBox from "../../UI/TableCheckBox";
import React from "react";

const columnHelperT = createColumnHelper<Project>()
export const columns = [
    columnHelperT.accessor('id', {
        // cell: ({row}) => (
        //     <div className="px-1">
        //         <TableCheckBox
        //             {...{
        //                 checked: row.getIsSelected(),
        //                 disabled: !row.getCanSelect(),
        //                 indeterminate: row.getIsSomeSelected(),
        //                 onChange: row.getToggleSelectedHandler(),
        //             }}
        //         />
        //     </div>
        // ),
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