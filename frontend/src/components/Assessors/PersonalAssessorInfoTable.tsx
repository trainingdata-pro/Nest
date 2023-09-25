import React, {useEffect, useState} from 'react';
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import {useForm} from "react-hook-form";
import {AssessorPatch} from "./AssessorPage";
import {Assessor} from "../../models/AssessorResponse";

const PersonalAssessorInfoTable = ({data}: any) => {

    useEffect(() => {
        setValue("last_name", data.last_name)
        setValue("first_name", data.first_name)
        setValue("middle_name", data.middle_name)
        setValue("username", data.username)
        setValue("manager", data.manager.last_name)
        setValue("email", data.email)
        setValue("country", data.country)
    }, []);
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

    function Submit(data: any) {
        if (!editable) {
            setEditable(false)
        } else {
            setEditable(true)
        }
    }

    const [editable, setEditable] = useState(true)
    return (
        <div className="container">
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
    );
};

export default PersonalAssessorInfoTable;