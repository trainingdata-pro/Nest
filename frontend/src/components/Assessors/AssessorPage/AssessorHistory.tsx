import React, {useEffect, useState} from 'react';
import AssessorService from "../../../services/AssessorService";
import {useQuery} from "react-query";
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
import {columns, FiredAssessor} from "../../FreeResource/OwnDesires/columns";
import {IHistory} from "../../../models/AssessorResponse";
import Table from "../../UI/Table";

const columnHelper = createColumnHelper<IHistory>()
const AssessorHistory = ({assessorId}: {
    assessorId: number | string | undefined
}) => {

    const {data} = useQuery(['fullAssessorHistory', assessorId], () => fetchAllData(), {})

    async function fetchAllData() {
        const allData = [];
        let currentPage = 1;
        let hasMoreData = true;
        while (hasMoreData) {
            const data = await AssessorService.fetchHistoryByAssessor(assessorId, currentPage);
            allData.push(...data.results);
            if (data.next !== null) {
                currentPage++;
            } else {
                hasMoreData = false;
            }
        }
        return allData;
    }

    const columns = [
        columnHelper.accessor('timestamp', {
            header: 'Время',
            cell: info => info.getValue().split('.')[0].replace('T', ' ')
        }),
        columnHelper.accessor('attribute', {
            header: 'Аттрибут'
        }),
        columnHelper.accessor('old_value', {
            header: 'Старое значение'
        }),
        columnHelper.accessor('new_value', {
            header: 'Новое значение'
        }),
        columnHelper.accessor('action', {
            header: 'Действие'
        }),
        columnHelper.accessor('reason', {
            header: 'Причина'
        }),
        columnHelper.accessor('user', {
            header: 'Пользователь',

        }),

    ]
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data: data ? data : [],
        columns,
        enableSorting: false,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: "includesString",
        state: {
            rowSelection,
            sorting,
        },
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        debugTable: false,
    })
    return (
        <>
            <div className='border-b border-black w-full'>
                <h1 className='px-4 py-2'>История</h1>
            </div>
            <div className='px-2 mt-2'>
                <Table pages={true} rowSelection={rowSelection} table={table}/>
            </div>
        </>
    );
};

export default AssessorHistory;