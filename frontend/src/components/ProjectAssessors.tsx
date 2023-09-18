import React, {useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import {Assessor} from "../models/AssessorResponse";
import Table from "./UI/Table";
import ProjectService from "../services/ProjectService";
import {Project} from "../models/ProjectResponse";
import Dialog from "./UI/Dialog";
import AddAssessorForm from "./Assessors/AddAssessorForm";
import Header from './Header/Header';
import ProjectForm from "./ProjectForm";

const ProjectAssessors = () => {
        const columnHelper = createColumnHelper<Assessor>()
        const columns: ColumnDef<Assessor>[] = [
            columnHelper.group({
                id: 'fio',
                header: () => 'ФИО',
                columns: [
                    columnHelper.accessor('last_name', {
                        header: 'Фамилия',
                        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
                        enableSorting: false
                    }),
                    columnHelper.accessor('first_name', {
                        header: 'Имя',
                        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
                        enableSorting: false
                    }),
                    columnHelper.accessor('middle_name', {
                        header: 'Отчество',
                        cell: info => <NavLink to={`/assessor/${info.row.original.id}`}>{info.getValue()}</NavLink>,
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
        const [project, setProject] = useState<Project>({} as Project)
        const {id} = useParams()
        useMemo(() => {
            ProjectService.fetchProject(id).then(res => setProject(res.data))
            ProjectService.fetchProjectAssessors(id)
                .then(res => setData(res.data.results))
                .catch(e => console.log(e))
        }, [])
        const [addToProject, setAddToProject] = useState(false)
        const [addAssessor, setAddAssessor] = useState(false)
        const [data, setData] = useState<Assessor[]>([])
        return (
            <div>
                <Dialog isOpen={addToProject} setIsOpen={setAddToProject}>
                    <div></div>
                </Dialog>
                <Dialog isOpen={addAssessor} setIsOpen={setAddAssessor}>
                    <AddAssessorForm assessors={data} setAssessors={setData} showSidebar={addAssessor}
                                     setShowSidebar={setAddAssessor}/>
                </Dialog>

                <Header/>

                <div className="flex-col container mx-auto pt-[70px] pr-8 pl-8 items-center">
                    <div className="flex justify-between my-2">
                        <div className="flex items-center">
                            <div className="pl-[15px]">{project.name}</div>
                        </div>
                        <div>
                            <button className="bg-[#5970F6] text-white py-[8px] px-[15px] mx-2 rounded-[8px]">Меню проекта</button>
                            <button className="bg-[#5970F6] text-white py-[8px] px-[15px] mx-2 rounded-[8px]" onClick={() => setAddToProject(true)}>Добавить на проект</button>
                            <button className="bg-[#5970F6] text-white py-[8px] px-[15px] mx-2 rounded-[8px]" onClick={() => setAddAssessor(true)}>Добавить ассессора</button>
                            <button className="border border-[#5970F6] py-[8px] px-[15px] mx-2 rounded-[8px]">Экспорт данных</button>
                        </div>
                    </div>
                    <div className="h-full w-full">
                        <div className="rounded-t-[20px] border border-b-gray-400 bg-white">
                            <Table data={data} columns={columns} pages={false}/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
;

export default ProjectAssessors;