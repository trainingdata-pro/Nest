import React, {useContext, useEffect, useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import {Assessor, AssessorWorkingTime} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import {ColumnDef} from "@tanstack/react-table";
import {Project} from "../../models/ProjectResponse";
import Table from "../UI/Table";
import {ManagerData} from "../../store/store";
import {IManager} from "../../models/ManagerResponse";
import {Calendar} from "primereact/calendar";
import ProjectService from "../../services/ProjectService";
import {Context} from "../../index";

const AssessorPage = () => {
    const columnsInfo = useMemo<ColumnDef<Assessor>[]>(() => {
        return [
            {
                accessorKey: 'last_name',
                header: 'Фамилия',
                cell: info => info.getValue(),
                enableSorting: false,
            },
            {
                accessorKey: 'first_name',
                header: 'Имя',
                cell: info => info.getValue(),
                enableSorting: false,

            },
            {
                accessorKey: 'middle_name',
                header: 'Отчество',
                cell: info => info.getValue(),
                size: 30,
                enableSorting: false

            },
            {
                accessorKey: 'username',
                header: 'Ник в TG',
                cell: info => info.getValue(),
                enableSorting: false

            },
            {
                accessorKey: 'manager',
                header: 'Ответственный менеджер',
                cell: info => info.row.original.manager.last_name,
                enableSorting: false

            },
            {
                accessorKey: 'email',
                header: 'Почта',
                cell: info => info.getValue(),
                enableSorting: false

            },
            {
                accessorKey: 'country',
                header: 'Страна',
                cell: info => info.getValue(),
                enableSorting: false

            }
        ];
    }, [])


    const id = useParams()["id"]
    useEffect(() => {
        setIsLoading(true)
        AssessorService.fetchAssessor(id).then(res => {
            console.log(res.data)
            setAssessor(res.data)
            setIsLoading(false)
        })
    }, [])
    const [assessor, setAssessor] = useState<Assessor>({
        blacklist: false,
        country: "",
        date_of_registration: "",
        email: "",
        first_name: "",
        id: 0,
        is_free_resource: false,
        last_name: "",
        manager: {} as IManager,
        middle_name: "",
        projects: [],
        second_manager: [],
        skills: [],
        status: "",
        username: "",
        working_hours: {} as AssessorWorkingTime
    })
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div>
            <header className="fixed h-20 w-screen border-b border-gray-200 bg-white">
                <div className="flex container mx-auto h-full pr-8 pl-8 items-center">
                    <div
                        className="inline-flex items-center border border-b-black hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                    >
                        <NavLink
                            to='/dashboard/main'>Service Desk</NavLink>
                    </div>

                    <div className="border border-black ml-3 h-10 py-2 px-4">
                        {assessor?.last_name} {assessor?.first_name}
                    </div>
                </div>
            </header>

            <div className="container pt-20 h-full pr-8 pl-8 items-center">
                <div className="mt-5 h-full w-full">
                    <div className="rounded-md border border-b-gray-400 bg-white">
                        <Table data={[{...assessor}]} columns={columnsInfo} pages={false}/></div>
                </div>
            </div>
            <div className="container h-full pr-8 pl-8 items-center">
                <div className="mt-5 h-full w-full">
                    <div className="rounded-md border border-b-gray-400 bg-white">
                        <table className="w-full">
                            <thead>
                            <tr
                                className="border-b transition-colors data-[state=selected]:bg-muted">
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    Название проекта
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    Менеджер проекта
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    Статус
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    ПН
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    ВТ
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    СР
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    ЧТ
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    ПТ
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    СБ
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    ВС
                                </th>
                                <th className="items-center py-2 text-[#64748b] text-sm">
                                    Всего
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {assessor.projects.map(project => <tr key={project.id}
                                                                  className="border-b transition-colors hover:bg-gray-100">
                                <td className="text-center py-2 text-[#64748b] text-sm">{project.name}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">менеджер</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.status}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.working_hours?.monday}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.working_hours?.tuesday}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.working_hours?.wednesday}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.working_hours?.thursday}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.working_hours?.friday}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.working_hours?.saturday}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.working_hours?.sunday}</td>
                                <td className="text-center py-2 text-[#64748b] text-sm">{assessor.working_hours?.sunday +
                                    assessor.working_hours?.monday + assessor.working_hours?.saturday + assessor.working_hours?.friday + assessor.working_hours?.tuesday + assessor.working_hours?.wednesday + assessor.working_hours?.thursday}</td>
                            </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AssessorPage;