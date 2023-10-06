import React, {useContext, useState} from 'react';
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import {useForm} from "react-hook-form";
import AssessorService from "../../services/AssessorService";
import {useMutation, useQuery} from "react-query";
import {Context} from "../../index";
import Loader from "../UI/Loader";
import MiniLoader from "../UI/MiniLoader";
interface PersonalTableProps{
    last_name: string,
    first_name: string,
    middle_name: string,
    username: string,
    email: string,
    country: string
}

const PersonalAssessorInfoTable = ({assessorId}: {assessorId: string | number | undefined }) => {
    const assessor = useQuery(['currentAssessorInfo'], () => AssessorService.fetchAssessor(assessorId),{
        onSuccess: data => {
            setValue("last_name", data?.last_name)
            setValue("first_name", data?.first_name)
            setValue("middle_name", data?.middle_name)
            setValue("username", data?.username)
            setValue("email", data?.email)
            setValue("country", data?.country)
        }
    })
    const patchAssessorInfo = useMutation(['currentAssessorInfo'], ({id, data}: any) => AssessorService.patchAssessor(id, data),{
        onError: error => console.log(error)
    })
    const {store} = useContext(Context)
    const {
        register,
        formState: {
            errors
        },
        setValue,
        getValues,
    } = useForm<any>()
    function Submit() {
        let data = getValues()
        data = {...data, country: data.country.value}
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            if (data.email === assessor.data?.email){
                const {email, ...rest} = data
                patchAssessorInfo.mutate({id: assessorId, data:rest})
            } else {
                patchAssessorInfo.mutate({id: assessorId, data:data})
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
                        <input placeholder={!getValues('last_name') ? 'Загрузка' : 'Фамилия'} disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('last_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <input placeholder={!getValues('first_name') ? 'Загрузка' : 'Имя'} disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('first_name')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <input placeholder={!getValues('middle_name') ? 'Загрузка' : 'Отчество'} disabled={isDisabled} className="block w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('middle_name')}/>
                    </td>
                    <td className="text-center whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        {!getValues('username') ? <MiniLoader size={15}/> : <input placeholder={!getValues('username') ? 'Загрузка' : 'Ник в ТГ'} disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('username')}/>}
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px] text-center">
                        {assessor.data?.manager ? `${assessor.data?.manager.last_name} ${assessor.data?.manager.first_name}`: <p className='text-gray-400'>Загрузка</p>}
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <input disabled={isDisabled} className="w-full text-center bg-white border border-gray-400 disabled:border-none disabled:opacity-50" {...register('email')}/>
                    </td>
                    <td className="whitespace-nowrap border-r dark:border-neutral-500 py-[5px]">
                        <select disabled={isDisabled} {...register('country')}>
                            <option></option>
                            {countryObject.map(country => <option key={country} value={country}>{country}</option>)}
                        </select>
                    </td>
                        <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">{assessor.data?.manager.id === store.user_id ? ( isDisabled ? <PencilSquareIcon onClick={Submit} className="h-6 w-6 text-black cursor-pointer"/> : <CheckIcon onClick={Submit} className="h-6 w-6 text-black cursor-pointer"/>): <PencilSquareIcon className="h-6 w-6 text-gray-400"/>}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PersonalAssessorInfoTable;