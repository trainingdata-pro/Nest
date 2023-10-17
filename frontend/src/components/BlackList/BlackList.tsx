import React, {useEffect, useState} from 'react';
import AssessorService from "../../services/AssessorService";

import {useMutation, useQuery} from "react-query";
import Header from "../Header/Header";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {columns} from './columns';
import Table from "../UI/Table";
import Dialog from "../UI/Dialog";
import Export from "./Export";
import MyButton from "../UI/MyButton";

const BlackList = () => {
    const [globalFilter, setGlobalFilter] = React.useState('')
    const blacklist = useQuery(['blacklist'], () => fetchAllData())
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    async function fetchAllData() {
        const allData = [];
        let currentPage = 1;
        let hasMoreData = true;
        while (hasMoreData) {
            const data = await AssessorService.getBlackList(currentPage);
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
        data: blacklist.data ? blacklist.data : [],
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
        enableSorting:true,
        onRowSelectionChange: setRowSelection,
        debugTable: false,
    })
    console.log(table)
    const [filteredRows, setFilteredRows] = useState<any>([])
    const [isExportBlackList, setIsExportBlackList] = useState(false)
    useEffect(() => {
        setFilteredRows(table.getFilteredRowModel().rows.map(row => row.original.id))
    }, [globalFilter,sorting]);
    return (
        <>
            <Header/>
            <Dialog isOpen={isExportBlackList} setIsOpen={setIsExportBlackList}>
                <Export setIsExportBlackList={setIsExportBlackList} items={filteredRows}/>
            </Dialog>
            <div className='pt-20 px-8'>
                <div className="flex justify-between space-x-2 items-center mb-2">
                    <div className="relative">
                        <input className='border border-black rounded-[8px] px-[8px] py-[5px] pr-[30px]'
                               placeholder='Поиск по ФИО' value={globalFilter}
                               onChange={(event) => setGlobalFilter(event.target.value)}/>
                        <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>

                    </div>
                    <MyButton onClick={() => setIsExportBlackList(true)}>Экспорт данных</MyButton>
                </div>
                <Table pages={true} rowSelection={rowSelection} table={table}/>
            </div>
        </>
    );
};

export default BlackList;