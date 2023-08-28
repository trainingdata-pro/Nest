import React, {useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import {
    ColumnDef, ColumnFiltersState, createColumnHelper,
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Assessor} from "../models/AssessorResponse";
import AssessorService from "../services/AssessorService";
import Table from "./UI/Table";
import ProjectService from "../services/ProjectService";
import {Project} from "../models/ProjectResponse";

const ProjectAssessors = () => {
    const columnHelper = createColumnHelper<Assessor>()
        const columns: ColumnDef<Assessor>[] = [
            columnHelper.group({
                id: 'fio',
                header: () => 'ФИО',
                columns: [
                    columnHelper.accessor('last_name', {
                        header: 'Фамилия',
                        cell: info => info.getValue(),
                        enableSorting: false
                    }),
                    columnHelper.accessor('first_name', {
                        header: 'Имя',
                        cell: info => info.getValue(),
                        enableSorting: false
                    }),
                    columnHelper.accessor('middle_name', {
                        header: 'Отчество',
                        cell: info => info.getValue(),
                        enableSorting: false
                    }),
                ],
            }),
            columnHelper.group({
                id: 'username',
                header: () => 'Ник в ТГ',
                columns: [
                    columnHelper.accessor('username', {
                        header: "",
                        cell: info => {
                            return info.getValue()
                        },
                        enableSorting: false
                    })
                ]
            }),
            columnHelper.group({
                id: 'workingTime',
                header: () => 'Рабочее время',
                columns: [
                    columnHelper.accessor('working_hours.monday', {
                        header: "ПН",
                        cell: info => info.row.original.working_hours?.monday ? info.row.original.working_hours?.monday : 0,
                        enableSorting: false,
                        size: 20
                    }),
                    columnHelper.accessor('working_hours.tuesday', {
                        header: "ВТ",
                        cell: info => info.row.original.working_hours?.tuesday ? info.row.original.working_hours?.tuesday : 0,
                        enableSorting: false,
                        size: 20
                    }),
                    columnHelper.accessor('working_hours.thursday', {
                        header: "СР",
                        cell: info => info.row.original.working_hours?.wednesday ? info.row.original.working_hours?.wednesday : 0,
                        enableSorting: false,
                        size: 20
                    }),
                    columnHelper.accessor('working_hours.friday', {
                        header: "ЧТ",
                        cell: info => info.row.original.working_hours?.thursday ? info.row.original.working_hours?.thursday : 0,
                        enableSorting: false,
                        size: 20
                    }),
                    columnHelper.accessor('working_hours.saturday', {
                        header: "ПТ",
                        cell: info => info.row.original.working_hours?.friday ? info.row.original.working_hours?.friday : 0,
                        enableSorting: false,
                        size: 20
                    }),
                    columnHelper.accessor('working_hours.sunday', {
                        header: "СБ",
                        cell: info => info.row.original.working_hours?.saturday ? info.row.original.working_hours?.saturday : 0,
                        enableSorting: false,
                        size: 20
                    }),
                    columnHelper.accessor('working_hours.monday', {
                        header: "ВС",
                        cell: info => info.row.original.working_hours?.sunday ? info.row.original.working_hours?.sunday : 0,
                        enableSorting: false,
                        size: 20
                    })
                ]
            }),
            columnHelper.group({
                id: 'totalHours',
                header: () => 'Всего',
                columns: [
                    columnHelper.accessor('working_hours', {
                        header: "",
                        cell: info => {
                            const hours = [info.row.original.working_hours?.monday ? info.row.original.working_hours?.monday : 0,
                            info.row.original.working_hours?.tuesday ? info.row.original.working_hours?.tuesday : 0,
                            info.row.original.working_hours?.wednesday ? info.row.original.working_hours?.wednesday : 0,
                            info.row.original.working_hours?.thursday ? info.row.original.working_hours?.thursday : 0,
                            info.row.original.working_hours?.friday ? info.row.original.working_hours?.friday : 0,
                            info.row.original.working_hours?.saturday ? info.row.original.working_hours?.saturday : 0,
                            info.row.original.working_hours?.sunday ? info.row.original.working_hours?.sunday : 0]
                            const total = hours.reduce(
                                (total, currentItem) => (total = total + currentItem), 0)
                            return total


                        },
                        enableSorting: false
                    })
                ]
            }),
            columnHelper.group({
                id: 'status',
                header: () => 'Статус',
                columns: [
                    columnHelper.accessor('status', {
                        header: "",
                        cell: info => {
                            return 'Полная загрузка'
                        },
                        enableSorting: false
                    })
                ]
            }),
            columnHelper.group({
                id: 'Skills',
                header: "Skills",
                columns: [
                    columnHelper.accessor('skills', {
                        header: "",
                        cell: (info) => {
                            return <div>{info.row.original.skills.map(skill => {
                                return <div key={skill.id}>{skill.title}</div>
                            })}</div>
                        },
                        enableSorting: false
                    })
                ]
            })

        ]
        const [project, setProject] = useState<Project>()
        const id = useParams()["id"]
        useMemo(() => {
            ProjectService.fetchProject(id).then(res => setProject(res.data))
            ProjectService.fetchProjectAssessors(id)
                .then(res => setData(res.data.results))
                .catch(e => console.log(e))
        }, [])

        const [data, setData] = useState<Assessor[]>([])
        return (
            <div>
                <header className="fixed w-screen h-20 border-b border-gray-200 bg-white">

                    <div className="flex container mx-auto h-full pr-8 pl-8 items-center">
                        <div className="flex w-full items-center justify-between">
                            <div className="flex">
                            <div
                                className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                            >
                                <NavLink
                                    to='/dashboard/main'>Service Desk</NavLink>
                            </div>
                            <div className="border border-black px-3 py-2 rounded-md">
                                {project?.name}
                            </div>
                            </div>
                        </div>
                            <nav className="flex items-center justify-between">
                                <ul className="flex list-none items-center space-x-1">

                                    <div className="flex justify-end">
                                        <li>
                                            <NavLink
                                                className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                                to='/profile'>Добавить на проект</NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                                to='/dashboard/check'>Создать ассессора</NavLink>
                                        </li>
                                    </div>
                                </ul>
                            </nav>
                            

                    </div>
                </header>
                <div className="flex container mx-auto pt-20 h-full pr-8 pl-8 items-center">
                    <div className="h-full w-full">
                        <div className="rounded-md border border-b-gray-400 bg-white">
                            <Table data={data} columns={columns} pages={false}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
;

export default ProjectAssessors;