import {flexRender, getCoreRowModel, useReactTable} from "@tanstack/react-table";
import Icon from "@mdi/react";
import {mdiSort, mdiSortAscending, mdiSortDescending} from "@mdi/js";
import React, {Dispatch} from "react";
import TablePagination from "./TablePagination";
import Loader from "./Loader";


const Table = ({data, isLoading, columns, totalRows, currentPage, setCurrentPage, setPageLimit, pageLimit, height = 'h-[calc(100vh-150px)]'}: {
    data: any[],
    isLoading? : boolean
    columns: any[],
    totalRows: number,
    currentPage: number,
    totalPages?: number,
    setCurrentPage: Dispatch<number>,
    setPageLimit: Dispatch<number>,
    pageLimit: number,
    height?: string
}) => {
    const table = useReactTable({
        data: data ? data : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableSorting: false
    })

    return (
        <div className="w-full relative border-collapse border-spacing-0">
            <div className={`rounded-t-[20px] bg-white overflow-y-auto ${height}`}>
                <table className="w-full h-fit mb-[50px]">
                    <thead className='sticky top-0' id={'thead'}>
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
                                        className="items-center h-full bg-[#E7EAFF] py-2 text-[#64748b] text-sm border-r border-r-gray-300 last:border-none">
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
                    {isLoading ? <tbody><tr><td colSpan={30}><Loader/></td></tr></tbody>:
                    <tbody className='h-full w-full'>
                    {table.getRowModel().rows.length !== 0 ?
                        (table.getRowModel().rows.map(row => (
                            <tr key={row.id}
                                className={row.getIsSelected() ? "border-b h-full transition-colors bg-gray-300" :
                                    "border-b transition-colors h-full hover:bg-gray-100"}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td className='border-r p-0 m-0 border-r-gray-300 h-full align-middle last:border-none'
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
                    </tbody>}

                </table>
                <div className='absolute bottom-[-1px] w-[calc(100%-19px)]' id='pagination'>
                    <TablePagination setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows}
                                               currentPage={currentPage} totalPages={Math.ceil(totalRows / pageLimit)}
                                               setCurrentPage={setCurrentPage}/>
                </div>

            </div>
        </div>
    );
};

export default Table;