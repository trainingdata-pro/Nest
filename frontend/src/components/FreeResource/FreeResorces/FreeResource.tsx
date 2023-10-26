import React, {useState} from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";

import {
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import {IFreeResources} from "../../../models/AssessorResponse";
import Table from "../../UI/Table";
import Loader from "../../UI/Loader";
import {observer} from "mobx-react-lite";
import TablePagination from "../../UI/TablePagination";
import {useSorting} from "./columns";

export interface FreeAssessor extends IFreeResources {
    last_manager: string,
    last_project: string
}

const FreeResource = ({globalFilter, setGlobalFilter}: {
    globalFilter: string,
    setGlobalFilter: React.Dispatch<string>
}) => {
    const {columns, sorting,selectedRows, getSortingString} = useSorting()
    const [rowSelection, setRowSelection] = React.useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const {
        data,
        isLoading
    } = useQuery(['freeResources', currentPage, sorting], () => AssessorService.fetchFreeResource(currentPage, getSortingString()), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / 10))
        }
    })
    console.log(selectedRows)
    const table = useReactTable({
        data: data ? data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        debugTable: true,
    })
    if (isLoading) return <Loader width={40}/>
    return (
        <div>
            <Table table={table}/>
            <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                             setCurrentPage={setCurrentPage}/>
        </div>
    );
};

export default observer(FreeResource);