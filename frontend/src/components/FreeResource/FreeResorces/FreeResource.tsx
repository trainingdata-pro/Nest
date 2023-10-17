import React from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";

import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
import {IFreeResources} from "../../../models/AssessorResponse";
import Table from "../../UI/Table";
import {columns} from "./columns";

export interface FreeAssessor extends IFreeResources{
    last_manager: string,
    last_project: string
}

const FreeResource = ({globalFilter, setGlobalFilter}:{
    globalFilter: string,
    setGlobalFilter: React.Dispatch<string>
}) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const freeResources = useQuery(['freeResources'], () => fetchAllData(), {
        keepPreviousData: true
    })

    async function fetchAllData() {
        const allData = [];
        let currentPage = 1;
        let hasMoreData = true;
        while (hasMoreData) {
            const data = await AssessorService.fetchFreeResource(currentPage);
            allData.push(...data.results);
            if (data.next !== null) {
                currentPage++;
            } else {
                hasMoreData = false;
            }
        }
        return allData;
    }
    const table = useReactTable({
        data: freeResources.data ? freeResources.data : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: "includesString",
        state: {
            rowSelection,
            sorting,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        debugTable: false,
    })

    return (
        <>
        <Table pages={true} rowSelection={rowSelection} table={table}/>
        </>
            );
};

export default FreeResource;