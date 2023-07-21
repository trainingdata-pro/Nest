import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    ColumnDef,
    ColumnFiltersState, flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {IndeterminateCheckbox} from "../utils/checkBox";
import Owner from "./Table/Owner";
import DropdownMenu from "./ui/DropDownMenu";
import Confirm from "./ui/ConfirmWindow";
import ActionMenu from "./ui/ActionMenu";
import Icon from "@mdi/react";
import {mdiSort, mdiSortAscending, mdiSortDescending} from "@mdi/js";
import ProjectsService from "../services/ProjectsService";
import {Context} from "../index";
import AssessorsService from "../services/AssessorsService";
import {observer} from "mobx-react-lite";
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

function DebouncedInput({
                            value: initialValue,
                            onChange,
                            debounce = 500,
                            ...props
                        }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}
// @ts-ignore
const AddAssessorToProject = ({id, close}) => {
    const columns = useMemo<ColumnDef<Project>[]>(() => [
        {
            id: 'select',
            header: '',
            cell: ({row}) => (
                <IndeterminateCheckbox key={row.id}
                                       {...{
                                           checked: row.getIsSelected(),
                                           disabled: !row.getCanSelect(),
                                           indeterminate: row.getIsSomeSelected(),
                                           onChange: row.getToggleSelectedHandler(),
                                       }}
                />
            ),
            size: 10,
            enableGlobalFilter:false
        },
        {
            accessorKey: 'id',
            header: 'id',
            cell: info => info.getValue(),
            size: 100,
            enableSorting: false,
            enableGlobalFilter:false
        },
        {
            accessorKey: 'name',
            header: 'Название проекта',
            cell: info => info.getValue(),
            size:400,

        },
        {
            accessorKey: 'owner.user.username',
            header: 'Владелец',
            cell: info => info.getValue(),
            enableSorting: false,
            enableGlobalFilter: false
        }

    ], [])
    const {store} = useContext(Context)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    useMemo(() => {
        // @ts-ignore
        ProjectsService.fetchManagerProjects(store.manager.manager_id).then(res => setData(res.data.results))
    },[])

    const [data, setData] = useState([])

    const [globalFilter, setGlobalFilter] = React.useState('')
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
        debugTable: true,
    })
    // @ts-ignore
    return (
        <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center">
            <div className="animate-in fade-in fixed inset-0 z-50 bg-white backdrop-blur- transition-opacity"></div>
            <div className="animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 fixed z-50 grid w-full gap-4 rounded-b-lg border bg-background p-6 shadow-lg sm:rounded-lg sm:max-w-[calc(100%-5rem)]">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left"><h2 id="radix-:r3n:"
                                                                                        className="text-lg font-semibold leading-none tracking-tight">Добавить
                    исполнителя в проекты</h2><p id="radix-:r3o:" className="text-sm text-muted-foreground">Выберите
                    проекты, в которые вы хотите добавить исполнителя, и нажмите продолжить</p></div>
                <div className="pb-3">
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full max-w-[30rem] bg-white"
                        placeholder="Искать по названию"
                    />
                </div>
                <div className="rounded-md border border-b-gray-400 bg-white">

                    <table className="w-full">
                        <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b transition-colors data-[state=selected]:bg-muted">
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

                        {data.length !== 0?<tbody>
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
                        </tbody>: <tbody><tr><td className="p-4 border-b align-middle [&amp;:has([role=checkbox])]:pr-0 h-24 text-center"
                                                 colSpan={9}>Нет результатов</td></tr></tbody>}
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
                                                     {table.getPageCount() !== 0?table.getState().pagination.pageIndex + 1: 0} из {' '}
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
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <button onClick={()=> {
                        store.setIsLoading(true)
                        // @ts-ignore
                        const projectIds = Object.keys(rowSelection).map(key => data.filter(row => table.getRow(key)._valuesCache['id'] === row.id)).map(k => k.map(k1 => k1.id))
                        AssessorsService.addAssessorToProject(id, projectIds[0])
                        close(false)
                        store.setIsLoading(false)
                    }}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                    >Продолжить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default observer(AddAssessorToProject);