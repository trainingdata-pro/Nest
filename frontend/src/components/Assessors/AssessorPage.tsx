import React, {useContext, useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import {Assessor, AssessorWorkingTime} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import {useForm} from "react-hook-form";
import {Context} from "../../index";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import {IManager} from "../../models/ManagerResponse";


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
    useMemo(async () => {
        await AssessorService.fetchAssessor(id).then(res => {
            setAssessor(res.data)
            setValue('last_name', res.data.last_name)
            setValue('first_name', res.data.first_name)
            setValue('middle_name', res.data.middle_name)
            setValue('username', res.data.username)
            setValue('manager', `${res.data.manager.last_name} ${res.data.manager.first_name}`)
            setValue('email', res.data.email)
            setValue('country', res.data.country)

        })
    }, [])
    const [editable, setEditable] = useState(true)
    const {
        watch,
        register,
        formState: {
            errors
        },
        setValue,
        getValues,
        handleSubmit
    } = useForm<AssessorPatch>()
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
    const {store} = useContext(Context)

    function Submit() {
        const values = getValues()
        if (editable) {
            setEditable(false)
        } else {

            console.log(values)
            setEditable(true)
        }
    }

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
            <div className="container pt-24">
                <table className="w-full border border-black">
                    <thead className="border border-black">
                    <tr>
                        <th>Фамилия</th>
                        <th>Имя</th>
                        <th>Отчество</th>
                        <th>Ник в ТГ</th>
                        <th>Отвественный менеджер</th>
                        <th>Почта</th>
                        <th>Страна</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="text-center">
                            <input disabled={!editable} className="w-full text-center" {...register('last_name')}/>
                        </td>
                        <td className="text-center">
                            <input disabled={!editable} className="w-full text-center" {...register('first_name')}/>
                        </td>
                        <td className="text-center">
                            <input disabled={!editable} className="w-full text-center" {...register('middle_name')}/>
                        </td>
                        <td className="text-center">
                            <input disabled={!editable} className="w-full text-center" {...register('username')}/>
                        </td>
                        <td className="text-center">
                            <input disabled={!editable} className="w-full text-center" {...register('manager')}/>
                        </td>
                        <td className="text-center">
                            <input disabled={!editable} className="w-full text-center" {...register('email')}/>
                        </td>
                        <td className="text-center">
                            <input disabled={!editable} className="w-full text-center" {...register('country')}/>
                        </td>
                        <td className="text-center" onClick={Submit}>
                            {editable ? <PencilSquareIcon className="h-6 w-6 text-black cursor-pointer"/> :
                                <CheckIcon className="h-6 w-6 text-black cursor-pointer"/>}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default AssessorPage;