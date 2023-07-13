import {observer} from "mobx-react-lite";
import React, {useContext, useEffect, useState} from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
    getSortedRowModel,
    SortingState,
    createColumnHelper, flexRender
} from "@tanstack/react-table";
import Icon from '@mdi/react';
import {mdiSortAscending, mdiSort, mdiSortDescending} from '@mdi/js';

type Person = {
    id: number
    firstName: string
    lastName: string
    middleName: string
    username: string
    project: string
    status: boolean
}

const defaultData: Person[] = [
    {
        id: 1,
        firstName: 'tanner',
        lastName: 'linsleyvvvvvvvv',
        middleName: 'petrov',
        username: 'vaneuss',
        project: 'In Relationship',
        status: true,
    },
    {
        id: 2,
        firstName: 'tandy',
        lastName: 'miller',
        middleName: "sidorov",
        username: "vaneuss1",
        project: 'Single',
        status: false,
    },
    {
        id: 3,
        firstName: 'tandy',
        lastName: 'miller',
        middleName: "sidorov",
        username: "vaneuss1",
        project: 'Single',
        status: false,
    },
]

const defaultColumns: ColumnDef<Person>[] = [
    {
        accessorKey: 'id',
        header: 'id',
        cell: info => info.getValue()
    },
    {
        accessorKey: 'lastName',
        header: 'Фамилия',
        cell: info => info.getValue()
    },
    {
        accessorKey: 'firstName',
        header: 'Имя',
        cell: info => info.getValue()
    },
    {
        accessorKey: 'middleName',
        header: 'Отчество',
        cell: info => info.getValue()
    },
    {
        accessorKey: 'username',
        header: 'Проект',
        cell: info => info.getValue()
    },
    {
        accessorKey: 'project',
        header: 'Проект',
        cell: info => info.getValue()
    },
    {
        accessorKey: 'status',
        header: 'Статус',
        cell: info => info.getValue() ? "Занят" : "Свободен"
    }
]

const AssessorTable = observer(() => {
    const [data, setData] = React.useState(() => [...defaultData])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columns] = React.useState<typeof defaultColumns>(() => [
        ...defaultColumns,
    ])
    const [columnVisibility, setColumnVisibility] = React.useState({})
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })
    return (<div className="container mx-auto h-full pr-8 pl-8">
            <div className="rounded-md border bg-white">
                <table className="w-full">
                    <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="border-b transition-colors data-[state=selected]:bg-muted">
                            {headerGroup.headers.map(header => (
                                <th key={header.id}
                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    {header.isPlaceholder ? null : (
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            <div className="flex justify-center">{flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                                {{
                                                        asc: <Icon className="pl-0.5" path={mdiSortAscending} size={1}
                                                                   color={'grey'}/>,
                                                        desc: <Icon className="pl-0.5" path={mdiSortDescending} size={1}
                                                                    color={'grey'}/>,
                                                    }[header.column.getIsSorted() as string] ??
                                                    <Icon className="pl-0.5" path={mdiSort} size={1} color={'grey'}/>}
                                            </div>
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}
                            className="border-b transition-colors data-[state=selected]:bg-muted hover:bg-gray-200">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}
                                    className="text-center min-w-full max-w-full p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
})

export default AssessorTable;