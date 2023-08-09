import React, {useContext, useEffect, useMemo, useState} from 'react';
import Icon from '@mdi/react';
import {mdiSortAscending, mdiSort, mdiSortDescending} from '@mdi/js';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
    getSortedRowModel,
    SortingState,
    flexRender,
    getFilteredRowModel, ColumnFiltersState
} from "@tanstack/react-table";

import {IndeterminateCheckbox} from '../utils/CheckBox'
import {Context} from '../index';
import {ManagerData} from "../store/store";
import ProjectService from '../services/ProjectService';
import AddProject from "./ProjectForm";
import {useNavigate} from "react-router-dom";
import {Project} from "../models/ProjectResponse";
import {observer} from "mobx-react-lite";

const PersonalAccountTable = () => {
    const {store} = useContext(Context)
    const navigation = useNavigate()
    const statusObject = {
        "active": "Активный",
        "pause": "На паузе",
        "completed": "Завершенный"
    }

    const columns = useMemo<ColumnDef<Project>[]>(() => {
        // @ts-ignore
        return [
            {
                accessorKey: 'name',
                header: 'Название проекта',
                cell: info => {
                    return <div
                        onClick={() => navigation(`/dashboard/projects/${info.row.original.id}`)}>{info.row.original.name}</div>
                },
                size: 200,
                enableSorting: false
            },
            {
                accessorKey: 'manager',
                header: 'Владелец',
                cell: (info) => {
                    const managers = info.getValue()
                    // @ts-ignore
                    return <div>{managers.map(manager => {
                        return <div key={manager.id}>{manager.last_name} {manager.first_name}</div>
                    })}</div>
                },
                enableSorting: false,

            },
            {
                accessorKey: 'assessors_count',
                header: 'Количество исполнителей',
                cell: info =>
                    // @ts-ignore
                    <div onClick={() => navigation(`/dashboard/projects/${info.row.original.id}/assessors`)}>{info.getValue()}</div>
                ,
                size: 30,
                enableGlobalFilter: false,

            },
            {
                accessorKey: 'backlog',
                header: 'Беклог проекта',
                cell: info => info.getValue(),
                size: 30,
                enableGlobalFilter: false

            },
            {
                accessorKey: 'status',
                header: 'Статус проекта',
                // @ts-ignore
                cell: info => statusObject[info.getValue()],
                size: 100,
                enableGlobalFilter: false

            }
        ];
    }, [])
    useEffect(() => {
        if(store.managerData.id){
            ProjectService.fetchProjects(store.managerData.id.toString())
                .then(res => setData(res.data.results))
                .catch(e => console.log(e))
        }

    }, [store.managerData])
    const [data, setData] = useState<Project[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [showAddProject, setShowAddProject] = useState(false)
    const table = useReactTable({
        data,
        columns,
        // Pipeline
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: "includesString",
        state: {
            rowSelection,
            sorting,
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        debugTable: false,
    })

    return (
        <div className="flex container mx-auto h-full pr-8 pl-8 items-center">
            <div className="h-full w-full">
                <div className="flex justify-end my-2">
                    <button className="bg-black rounded-md text-white px-4 py-2"
                            onClick={() => navigation('/dashboard/projects/add_project')}>Добавить проект
                    </button>

                </div>
                <div className="rounded-md border border-b-gray-400 bg-white">
                    <table className="w-full">
                        <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}
                                className="border-b transition-colors data-[state=selected]:bg-muted">
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th key={header.id} style={{
                                            width:
                                                header.getSize(),
                                        }}
                                            className="items-center py-2 text-[#64748b] text-sm">
                                            {header.isPlaceholder ? null : (
                                                // <div >
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

                        {data.length !== 0 ? <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}
                                className={row.getIsSelected() ? "border-b transition-colors bg-gray-300" :
                                    "border-b transition-colors hover:bg-gray-100"}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id} colSpan={1}>
                                            <div className="flex justify-center items-center align-middle py-2">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        </td>
                                    )
                                })}

                            </tr>
                        ))}
                        </tbody> : <tbody>
                        <tr>
                            <td className="p-4 border-b align-middle [&amp;:has([role=checkbox])]:pr-0 h-24 text-center"
                                colSpan={9}>Нет результатов
                            </td>
                        </tr>
                        </tbody>}
                        <tfoot>
                        <tr>

                            {/*<td className="flex justify-center items-center align-middle py-2">*/}
                            {/*    <IndeterminateCheckbox*/}
                            {/*        {...{*/}
                            {/*            checked: table.getIsAllPageRowsSelected(),*/}
                            {/*            disabled: store.manager.manager_id !== filterManager,*/}
                            {/*            indeterminate: table.getIsSomePageRowsSelected(),*/}
                            {/*            onChange: table.getToggleAllPageRowsSelectedHandler(),*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*</td>*/}
                            {/*<td colSpan={20}>Всего строк на странице: {table.getRowModel().rows.length}</td>*/}

                        </tr>
                        </tfoot>
                    </table>
                    <div className="px-2 py-3">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex-1 text-sm text-muted-foreground text-gray-400">
                                Выделено {Object.keys(rowSelection).length} из{' '}
                                {data.length} строк
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(PersonalAccountTable);