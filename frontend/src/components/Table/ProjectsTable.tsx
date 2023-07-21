import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useMemo, useState} from "react";
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
import ActionMenu from "../ui/ActionMenu";
import Icon from '@mdi/react';
import {mdiSortAscending, mdiSort, mdiSortDescending} from '@mdi/js';
import ProjectsService from "../../services/ProjectsService";
import {Context} from "../../index";
import {IndeterminateCheckbox} from "../../utils/checkBox";
import Confirm from "../ui/ConfirmWindow";
import DropdownMenu from "../ui/DropDownMenu";
import ManagerService from "../../services/ManagerService";
import {IManager} from "../../models/ManagerResponse";
import Owner from "./Owner";
import { Project } from "../../models/ProjectResponse";
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
function ProjectTable() {

    const {store} = useContext(Context)
    const [data, setData] = useState([])
    const [managers, setManagers] = useState<IManager[]>([])
    const [filterManager, setFilterManager] = useState<number>(store.manager.manager_id)

    useMemo(()=>{
        store.fetchProjects(store.manager.manager_id)
        setFilterManager(store.managerData.id)
        // @ts-ignore
        ManagerService.fetch_managers().then(res => setManagers(res.data.results))
    },[])

    useEffect(()=>{
        if (filterManager === 0){
            // @ts-ignore
            ProjectsService.fetchProjects().then(res => setData(res.data.results))
        }else{
            // @ts-ignore
            ProjectsService.fetchManagerProjects(filterManager).then(res => setData(res.data.results))
        }

    },[store.projects,filterManager])
    const columns = useMemo<ColumnDef<Project>[]>(() => [
        {
            id: 'select',
            header:({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        disabled: store.manager.manager_id !== filterManager,
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({row}) => (
                <IndeterminateCheckbox key={row.id}
                                       {...{
                                           checked: row.getIsSelected(),
                                           // @ts-ignore
                                           disabled: store.manager.manager_id !== row.getValue('owner').id,
                                           indeterminate: row.getIsSomeSelected(),
                                           onChange: row.getToggleSelectedHandler(),
                                       }}
                />
            ),
            size: 10,
            enableGlobalFilter:false
        },
        {
            accessorKey: 'name',
            header: 'Название проекта',
            cell: info => info.getValue(),
            size:300,
        },
        {
            accessorKey: 'owner',
            header: 'Владелец',
            cell: info => <Owner manager={info.getValue()}/>,
            enableSorting: true,

        },
        {
            accessorKey: 'assessors_count',
            header: 'Количество исполнителей',
            cell: info => info.getValue(),
            size:30,
            enableGlobalFilter: false

        },
        {
            accessorKey: 'date_of_create',
            header: 'Дата создания',
            cell: info => info.getValue(),
            size:100,
            enableGlobalFilter: false

        },
        {
            accessorKey: 'id',
            id:"id",
            header: '',
            // @ts-ignore
            cell:({row}) =>store.manager.manager_id === row.getValue('owner').id ? <DropdownMenu id={row.getValue("id")}/> : '',
            enableSorting: false,
            enableGlobalFilter:false
        }

    ], [filterManager])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
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
    const handleDeleteRows = () => {
        setShowConfirmation(true);
    };
    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };
    const handleDeleteOneProject = (id:number) => {
        store.deleteProject([id])
        setShowConfirmation(false);
    }
    const handleConfirmDelete = () => {
        const selectedProjects = Object.keys(rowSelection).map(key => table.getRow(key)._valuesCache['id']);
        // @ts-ignore
        store.deleteProject(selectedProjects)
        table.resetRowSelection();
        setShowConfirmation(false);
    };

    useEffect(() =>{

    }, [])
    // @ts-ignore
    return (
        <div className="container mx-auto pb-[15rem] pt-10">
            <div className="pb-3">
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full max-w-[30rem] bg-white"
                    placeholder="Искать по названию"
                />
            </div>
            {showConfirmation && (
                <Confirm cancel={handleCancelDelete} confirm={handleConfirmDelete}/>
            )}
            <select value={filterManager} onChange={(event) => {
                // @ts-ignore
                setFilterManager(Number(event.target.value));
            }} className="flex h-10 rounded-md border border-input mb-2 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full max-w-[30rem] bg-white"
            >  {<option value={0} >Все менеджеры</option>}
                {managers.map(manager => <option key={manager.id} value={manager.id} >{manager.last_name} {manager.first_name}</option>)}
            </select>
            <div className="rounded-md border border-b-gray-400 bg-white">
                <>
                    {Object.keys(rowSelection).length !== 0 && <ActionMenu handleDeleteRows={handleDeleteRows} />}
                </>

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
                    <tfoot>
                    <tr>

                        <td className="flex justify-center items-center align-middle py-2">
                        <IndeterminateCheckbox
                            {...{
                                checked: table.getIsAllPageRowsSelected(),
                                disabled: store.manager.manager_id !== filterManager,
                                indeterminate: table.getIsSomePageRowsSelected(),
                                onChange: table.getToggleAllPageRowsSelectedHandler(),
                            }}
                        />
                        </td>
                        <td colSpan={20}>Всего строк на странице: {table.getRowModel().rows.length}</td>

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
        </div>
    )
}

export default observer(ProjectTable);