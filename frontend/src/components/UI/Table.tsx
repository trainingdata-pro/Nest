import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import Icon from "@mdi/react";
import {mdiSort, mdiSortAscending, mdiSortDescending} from "@mdi/js";
import React, {Dispatch} from "react";
import TablePagination from "./TablePagination";


const Table = ({data, columns, totalRows, currentPage, totalPages, setCurrentPage, pages, setPageLimit, pageLimit}: {
    data: any[],
    columns: any[],
    totalRows: number,
    currentPage: number,
    totalPages: number,
    setCurrentPage: Dispatch<number>,
    pages: boolean,
    setPageLimit: Dispatch<number>,
    pageLimit: number
}) => {

    const table = useReactTable({
        data: data ? data : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableSorting: false
    })
    return (
        <div className="w-full">
            <div className="rounded-t-[20px] bg-white overflow-hidden">
                <table className="w-full h-full">
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
                                        className="items-center py-2 text-[#64748b] text-sm border-r border-r-gray-300 last:border-none">
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
                    <tbody className='h-full'>
                    {table.getRowModel().rows.length !== 0 ?
                        (table.getRowModel().rows.map(row => (
                            <tr key={row.id}
                                className={row.getIsSelected() ? "border-b transition-colors bg-gray-300" :
                                    "border-b transition-colors hover:bg-gray-100"}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td className='border-r border-r-gray-300 h-full align-middle last:border-none'
                                            key={cell.id}
                                            colSpan={1}>
                                            <div
                                                className="flex justify-center text-center h-full items-center align-middle break-words">
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
                {pages && <TablePagination setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                                                           setCurrentPage={setCurrentPage}/>}

            </div>
        </div>
    );
};

export default Table;