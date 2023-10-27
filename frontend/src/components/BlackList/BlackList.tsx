import React, {useEffect, useState} from 'react';
import AssessorService from "../../services/AssessorService";

import {useQuery} from "react-query";
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
import TablePagination from "../UI/TablePagination";
import Loader from "../UI/Loader";

const BlackList = () => {
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const blacklist = useQuery(['blacklist', currentPage, globalFilter], () => AssessorService.getBlackList(currentPage, globalFilter), {
        keepPreviousData: true,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / 10))
        }
    })


    const table = useReactTable({
        data: blacklist.isSuccess ? blacklist.data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    const [filteredRows, setFilteredRows] = useState<any>([])
    const [isExportBlackList, setIsExportBlackList] = useState(false)
    if (blacklist.isLoading) return <Loader width={30}/>
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
                <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                <Table table={table}/>
                <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                                 setCurrentPage={setCurrentPage}/>
                </div>
            </div>
        </>
    );
};

export default BlackList;