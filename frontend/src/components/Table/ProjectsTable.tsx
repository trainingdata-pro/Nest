import {observer} from "mobx-react-lite";
import React, {Fragment, useContext, useEffect, useMemo, useState} from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
    getSortedRowModel,
    SortingState,
    flexRender,
    getFilteredRowModel
} from "@tanstack/react-table";
import ActionMenu from "../ui/ActionMenu";
import Icon from '@mdi/react';
import {mdiSortAscending, mdiSort, mdiSortDescending} from '@mdi/js';
import ProjectsService from "../../services/ProjectsService";
import {Context} from "../../index";
import {IndeterminateCheckbox} from "../../utils/checkBox";
import Confirm from "../ui/ConfirmWindow";
import DropdownMenu from "../ui/DropDownMenu";

type Project = {
    id: number
    name: string
    owner: {
        id: number,
        user: {
            id: number,
            username: string,
            email: string
        },
        last_name: string,
        first_name: string,
        middle_name: string,
    }
}


// @ts-ignore
function ProjectTable({data, columns}) {
    const {store} = useContext(Context)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data,
        // @ts-ignore
        columns,
        // Pipeline
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            rowSelection,
            sorting
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        debugTable: true,
    })
    return (
        <div className="container mx-auto pb-[15rem] pt-10">
            {store.showConfirm && <Confirm id={store.selectedRow} />}
            <div className="rounded-md border border-b-gray-400 bg-white">
                <>
                    {Object.keys(rowSelection).length !== 0 && <ActionMenu/>}
                </>
                <table className="w-full">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="border-b transition-colors data-[state=selected]:bg-muted">
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}
                                        className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                        {header.isPlaceholder ? null : (
                                            <div {...{
                                                className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}>
                                                <div className="flex justify-center text-left">{flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                    {header.column.getCanSort() ? <span>
                                                {{
                                                        asc: <Icon className="pl-0.5" path={mdiSortAscending} size={1}
                                                                   color={'grey'}/>,
                                                        desc: <Icon className="pl-0.5" path={mdiSortDescending} size={1}
                                                                    color={'grey'}/>,
                                                    }
                                                        [header.column.getIsSorted() as string] ??
                                                    <Icon className="pl-0.5" path={mdiSort} size={1} color={'grey'}/>
                                                }
                                                </span> : null}
                                                </div>
                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                    </thead>

                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}
                            className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-gray-100">
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id}
                                        className="p-4 text-center align-middle [&:has([role=checkbox])]:pr-0">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="px-2 py-3">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex-1 text-sm text-muted-foreground text-gray-400">
                            Выделено {Object.keys(rowSelection).length} из{' '}
                            {data.length} Total Rows Selected
                        </div>
                        <div className="flex items-center space-x-6 lg:space-x-8">
                            <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium">Размер страницы</p>
                                <select
                                    className="flex items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8 w-[70px]"
                                    value={table.getState().pagination.pageSize}
                                    onChange={e => {
                                        table.setPageSize(Number(e.target.value))
                                    }}
                                >
                                    {[10, 20, 30, 40, 50].map(pageSize => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex w-[120px] items-center justify-center text-sm font-medium">
                                             <span className="flex items-center gap-1">
                                                 <div>Страница</div>
                                                 <strong>
                                                     {table.getState().pagination.pageIndex + 1} из {' '}
                                                     {table.getPageCount()}
                                                 </strong>
                                             </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    className={!table.getCanPreviousPage() ? "border rounded p-1 text-gray-300" : "border rounded p-1"}
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    {'<<'}
                                </button>
                                <button
                                    className={!table.getCanPreviousPage() ? "border rounded p-1 text-gray-300" : "border rounded p-1"}
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    {'<'}
                                </button>
                                <button
                                    className={!table.getCanNextPage() ? "border rounded p-1 text-gray-300" : "border rounded p-1"}
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    {'>'}
                                </button>
                                <button
                                    className={!table.getCanNextPage() ? "border rounded p-1 text-gray-300" : "border rounded p-1"}
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                >
                                    {'>>'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(ProjectTable);