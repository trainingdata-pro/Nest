import React, {useEffect, useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import {Assessor, AssessorWorkingTime} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import Table from "../UI/Table";
import {IManager} from "../../models/ManagerResponse";
import {useForm} from "react-hook-form";
import {fa} from "@faker-js/faker";

interface AssessorPatch {
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string,
    email: string,
    country: string,
    status: string,
    is_free_resource: boolean,
    free_resource_weekday_hours: number | string,
    free_resource_day_off_hours: number | string,
    manager: string,
    projects: number[],
    skills: number[]
}

const AssessorPage = () => {
    const id = useParams()["id"]
    useEffect(() => {
        setIsLoading(true)
        AssessorService.fetchAssessor(id).then(res => {
            setAssessor(res.data)
            // setValue('last_name', res.data.last_name)
            // setValue('first_name', res.data.first_name)
            // setValue('middle_name', res.data.middle_name)
            // setValue('username', res.data.username)
            // setValue('manager', res.data.manager.last_name)
            // setValue('email', res.data.email)
            // setValue('country', res.data.country)

        })
        setIsLoading(false)
    }, [])
    const columnHelper = createColumnHelper<Assessor>()
    const columnsInfoAssessor = useMemo<ColumnDef<Assessor>[]>(() => {
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
    const columnsInfo: ColumnDef<Assessor>[] = [
        columnHelper.group({
            id:"status",
            header: 'Статус',
            columns: [
                columnHelper.accessor('status', {
                    header: "",
                    cell: info => info.getValue(),
                    enableSorting: false,
                    size: 20
                })]
        }),
        columnHelper.group({
            id:"manager",
            header: 'Менеджер',
            columns: [
                columnHelper.accessor('manager', {
                    header: "",
                    cell: info => info.row.original.manager.last_name,
                    enableSorting: false,
                })]
        }),
        columnHelper.group({
            id:"projects",
            header: 'Проект',
            columns: [
                columnHelper.accessor('projects', {
                    header: "",
                    cell: info => info.row.original.projects.map((project, index) => (
                        <div key={index}>
                            {project.name}
                        </div>
                    )),
                    enableSorting: false,
                    size: 20
                })]
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
                columnHelper.accessor('working_hours.wednesday', {
                    header: "СР",
                    cell: info => info.row.original.working_hours?.wednesday ? info.row.original.working_hours?.wednesday : 0,
                    enableSorting: false,
                    size: 20
                }),
                columnHelper.accessor('working_hours.thursday', {
                    header: "ЧТ",
                    cell: info => info.row.original.working_hours?.thursday ? info.row.original.working_hours?.thursday : 0,
                    enableSorting: false,
                    size: 20
                }),
                columnHelper.accessor('working_hours.friday', {
                    header: "ПТ",
                    cell: info => info.row.original.working_hours?.friday ? info.row.original.working_hours?.friday : 0,
                    enableSorting: false,
                    size: 20
                }),
                columnHelper.accessor('working_hours.saturday', {
                    header: "СБ",
                    cell: info => info.row.original.working_hours?.saturday ? info.row.original.working_hours?.saturday : 0,
                    enableSorting: false,
                    size: 20
                }),
                columnHelper.accessor('working_hours.sunday', {
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
        })]
    const [editable, setEditable] = useState(false)
    const {register, setValue, handleSubmit} = useForm<AssessorPatch>()
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

            {/*<div className="pt-20 h-full w-full pr-8 pl-8 items-center">*/}
            {/*    <div className="mt-5 box-border">*/}
            {/*            <form className="w-full">*/}
            {/*                <div className="flex">*/}
            {/*                    <div className="border border-black">*/}
            {/*                        {editable ? <input className="border border-black max-w-min" {...register('last_name')}/> : <div>{assessor?.last_name}</div>}*/}
            {/*                    </div>*/}
            {/*                    <div className="border border-black px-4 py-2">*/}
            {/*                        {editable ? <input {...register('first_name')}/> :*/}
            {/*                            <div>{assessor?.first_name}</div>}*/}
            {/*                    </div>*/}
            {/*                    <div className="border border-black px-4 py-2">*/}
            {/*                        {editable ? <input {...register('middle_name')}/> :*/}
            {/*                            <div>{assessor?.middle_name}</div>}*/}
            {/*                    </div>*/}
            {/*                    <div className="border border-black px-4 py-2">*/}
            {/*                        {editable ? <input {...register('username')}/> : <div>{assessor?.username}</div>}*/}
            {/*                    </div>*/}
            {/*                    <div className="border border-black px-4 py-2">*/}
            {/*                        {editable ? <input {...register('manager')}/> :*/}
            {/*                            <div>{assessor?.manager.last_name}</div>}*/}
            {/*                    </div>*/}
            {/*                    <div className="border border-black px-4 py-2">*/}
            {/*                        {editable ? <input {...register('email')}/> : <div>{assessor?.email}</div>}*/}
            {/*                    </div>*/}
            {/*                    <div className="border border-black px-4 py-2">*/}
            {/*                        {editable ? <input {...register('country')}/> : <div>{assessor?.country}</div>}*/}
            {/*                    </div>*/}

            {/*                </div>*/}
            {/*            </form>*/}
            {/*        <button onClick={() => setEditable(!editable)}>Редактировать</button>*/}
            {/*            /!*<Table data={[{...assessor}]} columns={columnsInfoAssessor} pages={false}/>*!/*/}
            {/*        </div>*/}
            {/*    </div>*/}
            <div className="container pt-20 h-full pr-8 pl-8 items-center">
                <div className="mt-5 h-full w-full">
                    <div className="rounded-md border border-b-gray-400 bg-white">
                        <Table data={[{...assessor}]} columns={columnsInfo} pages={false}/>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AssessorPage;