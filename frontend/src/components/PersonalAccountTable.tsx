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
import Loader from "./UI/Loader";
import AddProjectButton from "./Projects/AddProjectButton";
import Table from "./UI/Table";
import Sidebar from "./UI/Sidebar";
import ProjectForm from "./ProjectForm";
import SideBar from "./UI/Dialog";

const PersonalAccountTable = () => {
    const {store} = useContext(Context)
    const navigation = useNavigate()
    const statusObject = {
        "active": "Активный",
        "pause": "На паузе",
        "completed": "Завершенный"
    }
    const [projectsId, setProjectId] = useState(0)
    const columns = useMemo<ColumnDef<Project>[]>(() => {
        return [
            {
                accessorKey: 'name',
                header: 'Название проекта',
                cell: info => {
                    return <div
                        onClick={() => {
                            setProjectId(info.row.original.id)
                            setShowSidebar(true)
                        }}>{info.row.original.name}</div>
                },
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
                    // @ts-ignore
                    <div onClick={() => navigation(`/dashboard/projects/${info.row.original.id}/assessors`)}>{info.getValue()}</div>
                ,
                size: 30,
                enableSorting: false

            },
            {
                accessorKey: 'backlog',
                header: 'Беклог проекта',
                cell: info => info.getValue(),
                size: 30,
                enableSorting: false

            },
            {
                accessorKey: 'status',
                header: 'Статус проекта',
                // @ts-ignore
                cell: info => statusObject[info.row.original.status],
                size: 100,
                enableGlobalFilter: false

            }
        ];
    }, [])

    const [isLoading, setIsLoading] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    useMemo(async () => {
        if (store.managerData.id) {
            setIsLoading(true)
            await ProjectService.fetchProjects(store.managerData.id.toString())
                .then(res => {
                    setData(res.data.results.filter(project => project.status !== 'completed'))

                })
                .catch(e => console.log(e))
            setIsLoading(false)
        }

    }, [store.managerData])
    const [data, setData] = useState<Project[]>([])
    if (isLoading) {
        return <Loader width={"16"}/>
    }
    return (
        <>
            <div className="flex container pt-20 h-full pr-8 pl-8 items-center">
                <SideBar isOpen={showSidebar} setIsOpen={setShowSidebar}>
                    <div className="w-[30rem]">
                    <ProjectForm projectId={projectsId}
                                     setNewData={setData}
                                     closeSidebar={setShowSidebar}/>
                    </div>
                    </SideBar>
                <div className="h-full w-full">
                    <div className="flex justify-end my-2">
                        <button className="bg-black rounded-md text-white px-4 py-2"
                                onClick={() => {
                                    setProjectId(0)
                                    setShowSidebar(true)
                                }}>Добавить проект
                        </button>
                    </div>
                    <div className="rounded-md border border-b-gray-400 bg-white">
                        <Table data={data} columns={columns} pages={true}/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default observer(PersonalAccountTable);