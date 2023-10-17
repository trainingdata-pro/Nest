import React, {useState} from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import FreeResourceTableRow from "../FreeResorces/FreeResourceEdit";
import FiredTableRow from "../../../pages/FiredTableRow";
import {
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {columns} from "./columns";
import Table from "../../UI/Table";

const OwnDesires = ({globalFilter, setGlobalFilter}:{
    globalFilter: string,
    setGlobalFilter: React.Dispatch<string>
}) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})

    const fired = useQuery(['fired'], () => fetchAllData(), {
        keepPreviousData: true
    })
    async function fetchAllData() {
        const allData = [];
        let currentPage = 1;
        let hasMoreData = true;
        while (hasMoreData) {
            const data = await AssessorService.fetchFired(currentPage);
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
        data: fired.data ? fired.data : [],
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
            <Table pages={true} rowSelection={rowSelection} table={table}/>
    );
};

export default OwnDesires;