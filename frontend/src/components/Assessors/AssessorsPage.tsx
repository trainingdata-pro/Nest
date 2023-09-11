import React, {useEffect, useState} from 'react';
import Table from "../UI/Table";
import {createColumnHelper} from "@tanstack/react-table";
import {NavLink, useNavigate} from "react-router-dom";
import {Assessor} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import AddAssessorForm from "../AddAssessorForm";
import SideBar from "../UI/Dialog";
import Dialog from "../UI/Dialog";

const AssessorsPage = () => {
    const statusObject = {
        "free": "Свободен",
        "full": "Занят",
        "partial": "Частичная загруженность"
    }
    const navigation = useNavigate()
    const columnHelper = createColumnHelper<Assessor>()
    useEffect(() => {
        AssessorService.fetchManagersAssessors().then(res => setAssessors(res.data.results))
    }, [])
    const [assessors, setAssessors] = useState<Assessor[]>([])


    const columns = [
        columnHelper.accessor('last_name', {
            header: 'Фамилия',
            cell: info => info.getValue(),
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
        columnHelper.accessor("username", {
            header: () => 'Ник в ТГ',
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor("projects", {
            header: () => 'Проекты',
            cell: (info) => {
                return <div>{info.row.original.projects.map(project => <div key={project.id} className="rounded-full bg-black text-white text-center py-1 px-3 mb-1">{project.name}</div>)}</div>
            },
            enableSorting: false
        }),
        columnHelper.accessor('working_hours', {
            header: "Рабочее время Всего",
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
        }),
        columnHelper.accessor('status', {
            header: "Статус",
            // @ts-ignore
            cell: info => <div className="text-center">{statusObject[info.row.original.status]}</div>,
            enableSorting: false,
            size:155

        }),
        columnHelper.accessor('skills', {
            header: "Skills",
            cell: (info) => {
                return <div>{info.row.original.skills.map(skill => {
                    return <div className="rounded-full bg-black text-white text-center py-1 px-3 mb-1" key={skill.id}>{skill.title}</div>
                })}</div>
            },
            enableSorting: false
        })
    ]
    const [showSidebar, setShowSidebar] = useState(false)
    return (
        <div>
            <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                <AddAssessorForm assessors={assessors} showSidebar={showSidebar} setShowSidebar={setShowSidebar} setAssessors={setAssessors}/>
            </Dialog>
            <header className="fixed h-20 w-screen z-10 border-b border-gray-200 bg-white">
                <div className="flex container mx-auto h-full pr-8 pl-8 items-center">
                    <div className="flex h-full w-full items-center justify-between gap-x-6">
                        <div
                            className="inline-flex items-center border border-b-black hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                        >
                            <NavLink
                                to='/dashboard/main'>Service Desk</NavLink>
                        </div>
                        <div className="border border-black px-3 py-2 rounded-md">Мои Разметчики</div>
                        <nav>
                            <button className="bg-black text-white rounded-md px-3 py-2" onClick={() => setShowSidebar(true)}>Создать асессора</button>
                        </nav>
                    </div></div></header>
            <div className="flex container mx-auto h-full pr-8 pl-8 items-center">
                <div className="h-full w-full">
                    <div className="rounded-md pt-20 border border-b-gray-400 bg-white">
                        <Table data={assessors} columns={columns} pages={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessorsPage;