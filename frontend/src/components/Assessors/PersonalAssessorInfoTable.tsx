import React, {useEffect, useState} from 'react';
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import {useForm} from "react-hook-form";
import {AssessorPatch} from "./AssessorPage";
import {Assessor} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import Select, { SingleValue } from "react-select";
import {SelectProps} from "../ProjectForm";
interface PersonalTableProps{
    last_name: string,
    first_name: string,
    middle_name: string,
    username: string,
    email: string,
    country: string
}
const PersonalAssessorInfoTable = ({data, assessorId}: { data: Assessor, assessorId: string | number | undefined }) => {
    const [assessor, setAssessor] = useState<PersonalTableProps>({...data})
    useEffect(() => {
        setValue("last_name", data.last_name)
        setValue("first_name", data.first_name)
        setValue("middle_name", data.middle_name)
        setValue("username", data.username)
        setValue("email", data.email)
        setValue("country", {label: data.country, value: data.country})
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
    } = useForm<any>()
    function Submit() {
        let data = getValues()
        data = {...data, country: data.country.value}
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            if (data.email === assessor.email){
                const {email, ...rest} = data
                AssessorService.patchAssessor(assessorId, rest)
            } else {
                AssessorService.patchAssessor(assessorId, data)
            }

            setIsDisabled(true)

        }
    }
    const countryObject:{ label: string; value: string}[] = [
        {label: "РФ", value: "РФ"},
        {label: "РБ", value: "РБ"},
        {label: "ПМР", value: "ПМР"},
        {label: "Другое", value: "Другое"},

    ]

    const [isDisabled, setIsDisabled] = useState(true)
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
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('last_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('first_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('middle_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('username')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[20px] text-center">
                        {data.manager.last_name} {data.manager.first_name}
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[20px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('email')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[20px]">
                        <Select
                            {...register('country')}
                            isSearchable={false}
                            isDisabled={isDisabled}
                            options={countryObject}
                            value={watch('country')}
                            onChange={(newValue) => setValue('country', newValue)}
                        />
                    </td>
                    <td className="whitespace-nowrap py-[20px]" onClick={Submit}>
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