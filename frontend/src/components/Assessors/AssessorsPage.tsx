import React, {useMemo} from 'react';
import Header from "../Header/Header";
import Table from "../UI/Table";
import {ColumnDef} from "@tanstack/react-table";
import {Project} from "../../models/ProjectResponse";
import {useNavigate} from "react-router-dom";

const AssessorsPage = () => {
    const navigation = useNavigate()
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
                    <div
                        onClick={() => navigation(`/dashboard/projects/${info.row.original.id}/assessors`)}>{info.row.original.id}</div>
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
    return (
        <div>
            <Header/>
            <div className="flex container mx-auto h-full pr-8 pl-8 items-center">
                <div className="h-full w-full">
                    <div className="rounded-md border border-b-gray-400 bg-white">
                        <Table data={[]} columns={columns}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessorsPage;