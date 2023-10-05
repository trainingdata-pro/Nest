import React, {useEffect, useState} from 'react';
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import {useForm} from "react-hook-form";
import {AssessorPatch} from "./AssessorPage";
import {Assessor} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import Select, { SingleValue } from "react-select";
import {SelectProps} from "../Projects/ProjectForm";
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
        setValue("last_name", data?.last_name)
        setValue("first_name", data?.first_name)
        setValue("middle_name", data?.middle_name)
        setValue("username", data?.username)
        setValue("email", data?.email)
        setValue("country", data?.country)
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
    const countryObject:string[] = [
        "РФ",
        "РБ",
        "ПМР",
        "Другое"

    ]

    const [isDisabled, setIsDisabled] = useState(true)
    return (
        <div className="z-0">
            <table className="w-full border border-black">
                <thead className="border border-black">
                <tr className="bg-[#E7EAFF]">
                    <th className="border-r dark:border-neutral-500 py-[5px]">Фамилия</th>
                    <th className="border-r dark:border-neutral-500 py-[5px]">Имя</th>
                    <th className="border-r dark:border-neutral-500 py-[5px]">Отчество</th>
                    <th className="border-r dark:border-neutral-500 py-[5px]">Ник в ТГ</th>
                    <th className="border-r dark:border-neutral-500 py-[5px]">Отвественный менеджер</th>
                    <th className="border-r dark:border-neutral-500 py-[5px]">Почта</th>
                    <th className="border-r dark:border-neutral-500 py-[5px]">Страна</th>
                    <th className="border-r dark:border-neutral-500 py-[5px]"></th>
                </tr>
                </thead>
                <tbody>
                <tr className='bg-white'>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('last_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('first_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <input disabled={isDisabled} className="block w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('middle_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('username')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px] text-center">
                        {data?.manager.last_name} {data?.manager.first_name}
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('email')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <select disabled={isDisabled} {...register('country')}>
                            {countryObject.map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                    </td>
                    <td className="whitespace-nowrap py-[5px]" onClick={Submit}>
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