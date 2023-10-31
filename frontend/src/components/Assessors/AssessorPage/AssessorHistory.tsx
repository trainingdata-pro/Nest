import React, {useState} from 'react';
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
import {IHistory} from "../../../models/AssessorResponse";
import Table from "../../UI/Table";
import TablePagination from "../../UI/TablePagination";

const columnHelper = createColumnHelper<IHistory>()
const AssessorHistory = ({assessorId}: {
    assessorId: number | string | undefined
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const {data, isSuccess} = useQuery(['fullAssessorHistory', assessorId, currentPage], () => AssessorService.fetchHistoryByAssessor(assessorId, currentPage), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / 10))
        }
    })

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
        data: isSuccess ? data.results : [],
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
                <Table table={table}/>
                <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
};

export default AssessorHistory;