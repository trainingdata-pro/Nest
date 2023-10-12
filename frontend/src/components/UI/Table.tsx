import React, {useEffect} from 'react';
import {flexRender, Table} from "@tanstack/react-table";
import Icon from "@mdi/react";
import {mdiSort, mdiSortAscending, mdiSortDescending} from "@mdi/js";
import {useMutation} from "react-query";
interface TableProps {
    pages: boolean,
    rowSelection: any,
    table: Table<any>
}

const MyTable = ({pages, rowSelection, table}: TableProps) => {
    return (
        <div className="h-full w-full">
        <div className="rounded-t-[20px] border border-black bg-white overflow-hidden mb-[10px]">
            <table className="w-full">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}
                        className="transition-colors data-[state=selected]:bg-muted bg-[#E7EAFF]">
                        {headerGroup.headers.map(header => {
                            return (
                                <th key={header.id} style={{
                                    width:
                                        header.getSize(),
                                }}
                                    colSpan={header.colSpan}
                                        className="items-center py-2 text-[#64748b] text-sm">
                                    {header.isPlaceholder ? null : (
                                        <div{...{
                                            className: header.column.getCanSort() ? 'flex justify-center items-center align-middle cursor-pointer select-none' : 'flex justify-center',
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}>{flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                            {header.column.getCanSort() ? <span>
                                                {{
                                                        asc: <Icon className="pl-0.5" path={mdiSortAscending} size={1}
                                                                   color={'#64748b'}/>,
                                                        desc: <Icon className="pl-0.5" path={mdiSortDescending} size={1}
                                                                    color={'#64748b'}/>,
                                                    }
                                                        [header.column.getIsSorted() as string] ??
                                                    <Icon className="pl-0.5" path={mdiSort} size={1} color={'#64748b'}/>
                                                }
                                                </span> : null}
                                        </div>
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.length !== 0 ?
                    (table.getRowModel().rows.map(row => (
                        <tr key={row.id}
                            className={row.getIsSelected() ? "border-b transition-colors bg-gray-300" :
                                "border-b transition-colors hover:bg-gray-100"}>
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id} colSpan={1}>
                                        <div className="flex justify-center items-center align-middle py-2 break-words">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    </td>
                                )
                            })}

                        </tr>
                    )))
                    :
                    (<tr>
                        <td className="p-4 border-b align-middle [&amp;:has([role=checkbox])]:pr-0 h-24 text-center"
                            colSpan={20}>Нет результатов
                        </td>
                    </tr>)
                }
                </tbody>
            </table>
            {pages && <div className="px-2 py-3">
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex-1 text-sm text-muted-foreground text-gray-400">
                        Выделено {Object.keys(rowSelection).length} из{' '}
                        {table.getRowModel().rows.length} строк
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Размер страницы</p>
                            <select
                                className="flex items-center rounded-md border border-input bg-transparent px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8"
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

                        <div className="inline-block text-sm font-medium">
                                             <span className="flex items-center ">
                                                 <div>Страница </div>
                                                 <strong>
                                                     {table.getPageCount() !== 0 ? table.getState().pagination.pageIndex + 1 : 0} из {' '}
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
            </div>}
        </div>
        </div>
    );
};

export default MyTable;