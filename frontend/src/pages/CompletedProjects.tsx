import React, {useContext, useEffect, useMemo, useState} from 'react';
import Header from "../components/Header/Header";
import {ColumnDef} from "@tanstack/react-table";
import {Project} from "../models/ProjectResponse";
import Table from "../components/UI/Table";
import ProjectService from "../services/ProjectService";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";

const CompletedProjects = () => {
    const statusObject = {
        "new": "Новый",
        "pilot": "Пилот",
        "active": "Активный",
        "pause": "На паузе",
        "completed": "Завершенный"
    }
    const {store} = useContext(Context)
    const navigation = useNavigate()
    useEffect(() => {
        ProjectService.fetchCompletedProjects(store.user_id).then(res => setCompletedProjects(res.data.results))
    }, [])
    const [completedProjects, setCompletedProjects] = useState<Project[]>([])
    const columns = useMemo<ColumnDef<Project>[]>(() => {
        return [
            {
                accessorKey: 'asana_id',
                header: 'Asana ID',
                cell: info => info.getValue(),
                size: 200,
            },
            {
                accessorKey: 'name',
                header: 'Название проекта',
                cell: info => info.getValue(),
                size: 200,
            },
            {
                accessorKey: 'manager',
                header: 'Владелец',
                cell: (info) => {
                    return <div>{info.row.original.manager.map(manager => {
                        return <div key={manager.id}>{manager.last_name} {manager.first_name}</div>
                    })}</div>
                },
                enableSorting: false,

            },
            {
                accessorKey: 'assessors_count',
                header: 'Количество исполнителей',
                cell: info =>
                    <div
                        onClick={() => navigation(`/dashboard/projects/${info.row.original.id}/assessors`)}>{info.row.original.assessors_count}</div>
                ,
                size: 30,
                enableSorting: false

            },
            {
                accessorKey: 'date_of_creation',
                header: 'Дата старта',
                cell: info => info.getValue(),
                size: 100,
                enableGlobalFilter: false

            },
            {
                accessorKey: 'date_of_completion',
                header: 'Дата завершения',
                cell: info => info.getValue(),
                size: 100,
                enableGlobalFilter: false

            }
        ];
    }, [])
    return (
        <div>
            <Header/>
            <div className="flex container pt-20 h-full pr-8 pl-8 items-center">
                <div className="h-full w-full">
                    <div className="rounded-t-[20px] border border-b-gray-400 bg-white">
                        <Table data={completedProjects} pages={true} columns={columns}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedProjects;