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
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }

    const [isDisabled, setIsDisabled] = useState(false)
    return (
        <div className="container">
            <table className="w-full border border-black">
                <thead className="border border-black">
                <tr className="bg-[#E7EAFF]">
                    <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Фамилия</th>
                    <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Имя</th>
                    <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Отчество</th>
                    <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Ник в ТГ</th>
                    <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Отвественный менеджер</th>
                    <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Почта</th>
                    <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Страна</th>
                    <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]"></th>
                </tr>
                </thead>
                <tbody>
                <tr className='bg-white'>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center" {...register('last_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center" {...register('first_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center" {...register('middle_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center" {...register('username')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center" {...register('manager')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center" {...register('email')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center" {...register('country')}/>
                    </td>
                    <td className="whitespace-nowrap px-[5px] py-[20px]" onClick={Submit}>
                        {isDisabled ? <PencilSquareIcon className="h-6 w-6 text-black cursor-pointer"/> :
                            <CheckIcon className="h-6 w-6 text-black cursor-pointer"/>}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PersonalAssessorInfoTable;