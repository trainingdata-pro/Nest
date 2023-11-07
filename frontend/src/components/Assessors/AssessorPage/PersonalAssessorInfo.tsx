import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import AssessorService from "../../../services/AssessorService";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Context} from "../../../index";
import {errorNotification, successNotification} from "../../UI/Notify";
import MiniLoader from '../../UI/MiniLoader';
import {CheckIcon, PencilSquareIcon} from '@heroicons/react/24/outline';
import {AxiosError} from "axios";
import {redirect, useNavigate} from "react-router-dom";

const Errors = {
    last_name: 'Фамилия',
    first_name: 'Имя',
    middle_name: 'Отчество',
    manager: 'Менеджер',
    username: 'Ник в ТГ',
    email: 'Почта',
    country: 'Страна'

}

interface PersonalTableProps {
    last_name: string,
    first_name: string,
    middle_name: string,
    manager: string
    username: string,
    email: string,
    country: string
}

interface CellProps {
    name: string,
    children: React.ReactNode
}

const FromCell = ({name, children}: CellProps) => {
    return (
        <div className={`flex flex-col border-r border-black ${name === 'Страна' ? 'basis-1/12' : 'basis-2/12'}`}>
            <label className='text-center font-[18px] border-b border-black bg-[#E7EAFF] py-2'>{name}</label>
            <div className="text-center whitespace-nowrap py-[10px]">
                {children}
            </div>
        </div>
    )
}
const PersonalAssessorInfo = ({assessorId}: { assessorId: string | number | undefined }) => {
    const queryClient = useQueryClient()
    const assessor = useQuery(['currentAssessorInfo'], () => AssessorService.fetchAssessor(assessorId), {
        onSuccess: data => {
            setValue("last_name", data?.last_name)
            setValue("first_name", data?.first_name)
            setValue("middle_name", data?.middle_name)
            setValue('manager', `${data?.manager.last_name} ${data?.manager.first_name}`)
            setValue("username", data?.username)
            setValue("email", data?.email)
            setValue("country", data?.country)
        }
    })
    const patchAssessorInfo = useMutation(['currentAssessorInfo', assessorId], ({
                                                                                    id,
                                                                                    data
                                                                                }: any) => AssessorService.patchAssessor(id, data), {
        onError: (error: AxiosError) => {
            const errors = error.response?.data ? error.response?.data : {}
            const keys = Object.keys(errors)
            // @ts-ignore
            const notify = <div>{keys.map(key => <p key={key}>{`${Errors[key]}: ${errors[key][0]}`}</p>)}</div>
            errorNotification(notify)
        },
        onSuccess: () => {
            successNotification('Информация успешно обновлена')
        }
    })
    const {store} = useContext(Context)
    const {
        register,
        setValue,
        getValues,
        handleSubmit
    } = useForm<PersonalTableProps>()
    function Submit() {
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            let data = getValues()
            if (data.username.length >= 5) {
                const {manager, ...assessorData} = data
                if (assessorData.email === '') {
                    const newData = {...assessorData, email: null}
                    patchAssessorInfo.mutate({id: assessorId, data: newData})
                } else {
                    if (assessorData.email === assessor.data?.email) {
                        const {email, ...rest} = assessorData
                        patchAssessorInfo.mutate({id: assessorId, data: rest})
                    } else {
                        patchAssessorInfo.mutate({id: assessorId, data: assessorData})
                    }

                }
                setIsDisabled(true)
            } else {
                errorNotification('Ник ТГ не может быть меньше 5 символов')
            }


        }
    }

    const countryList: string[] = [
        "РФ",
        "РБ",
        "ПМР",
        "Другое"
    ]
    const [isDisabled, setIsDisabled] = useState(true)
    return (
        <div className="z-0 rounded-[20px] overflow-hidden">
            <form className='flex flex-row' onSubmit={handleSubmit(Submit)}>
                <div className='bg-white flex basis-full'>
                    <FromCell name={'Фамилия'}>
                        {assessor.isLoading ? <MiniLoader size={15}/> : <input disabled={isDisabled}
                                                                               className="w-full text-center bg-white disabled:border-none disabled:opacity-50" {...register('last_name')}/>}
                    </FromCell>

                    <FromCell name={'Имя'}>
                        {assessor.isLoading ? <MiniLoader size={15}/> : <input disabled={isDisabled}
                                                                               className="w-full text-center bg-white disabled:border-none disabled:opacity-50" {...register('first_name')}/>}
                    </FromCell>
                    <FromCell name={'Отчество'}>
                        {assessor.isLoading ? <MiniLoader size={15}/> : <input disabled={isDisabled}
                                                                               className="block w-full text-center bg-white disabled:border-none disabled:opacity-50" {...register('middle_name')}/>}
                    </FromCell>

                    <FromCell name={'Ник в ТГ'}>
                        {assessor.isLoading ? <MiniLoader size={15}/> : <input disabled={isDisabled}
                                                                               className="w-full text-center bg-white disabled:border-none disabled:opacity-50" {...register('username')}/>}
                    </FromCell>
                    <FromCell name={'Менеджер'}>
                        {assessor.isLoading ? <MiniLoader size={15}/> : <input disabled={true}
                                                                               className="block w-full text-center bg-white disabled:border-none disabled:opacity-50" {...register('manager')}/>}
                    </FromCell>
                    <FromCell name={'Почта'}>
                        {assessor.isLoading ? <MiniLoader size={15}/> : <input disabled={isDisabled}
                                                                               className="w-full text-center bg-white disabled:border-none disabled:opacity-50" {...register('email')}/>}
                    </FromCell>
                    <FromCell name={'Страна'}>
                        {assessor.isLoading ? <MiniLoader size={15}/> :
                            <select className='w-full text-center' disabled={isDisabled} {...register('country')}>
                                <option disabled></option>
                                {countryList.map(country => <option key={country} value={country}>{country}</option>)}
                            </select>}
                    </FromCell>
                    <div className='flex flex-col justify-between py-3'>
                        {store.user_data.is_teamlead ? <button
                                disabled={store.team.find(manager => manager.user.id === assessor.data?.manager?.id) === undefined}
                                className='px-[7px]'>{

                                store.team.find(manager => manager.user.id === assessor.data?.manager?.id) !== undefined ? (isDisabled ?
                                        <PencilSquareIcon className="h-6 w-6 text-black cursor-pointer"/> :
                                        <CheckIcon className="h-6 w-6 text-black cursor-pointer"/>) :
                                    <PencilSquareIcon className="h-6 w-6 text-gray-400"/>
                            }</button> :
                            <button className='px-[7px]' disabled={assessor.data?.manager?.id !== store.user_id}>{
                                assessor.data?.manager?.id === store.user_id || (store.user_data.is_teamlead && assessor.data?.second_manager.find(man => man.id === store.user_id) !== undefined) ?
                                    (isDisabled ?
                                        <PencilSquareIcon className="h-6 w-6 text-black cursor-pointer"/> :
                                        <CheckIcon className="h-6 w-6 text-black cursor-pointer"/>) :
                                    <PencilSquareIcon className="h-6 w-6 text-gray-400"/>
                            }</button>}
                        {isDisabled ? <a href={`https://t.me/${getValues('username')}`}>
                            <svg className="h-6 w-6 text-black mx-auto"
                                 xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"
                                 fill="none">
                                <path
                                    d="M25 3.78509L21.3619 24.2393C21.3619 24.2393 20.8527 25.6574 19.4544 24.9773L11.0603 17.7997L11.0213 17.7785C12.1552 16.6431 20.9477 7.82695 21.3319 7.42733C21.9268 6.80842 21.5574 6.43995 20.8667 6.90749L7.87926 16.1055L2.86872 14.2254C2.86872 14.2254 2.08021 13.9126 2.00435 13.2324C1.92749 12.5512 2.89467 12.1827 2.89467 12.1827L23.3212 3.24632C23.3212 3.24632 25 2.4237 25 3.78509Z"
                                    fill="#000000"/>
                            </svg>
                        </a> : <svg className="h-6 w-6 text-gray-500 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"
                                    fill="none">
                            <path
                                d="M25 3.78509L21.3619 24.2393C21.3619 24.2393 20.8527 25.6574 19.4544 24.9773L11.0603 17.7997L11.0213 17.7785C12.1552 16.6431 20.9477 7.82695 21.3319 7.42733C21.9268 6.80842 21.5574 6.43995 20.8667 6.90749L7.87926 16.1055L2.86872 14.2254C2.86872 14.2254 2.08021 13.9126 2.00435 13.2324C1.92749 12.5512 2.89467 12.1827 2.89467 12.1827L23.3212 3.24632C23.3212 3.24632 25 2.4237 25 3.78509Z"
                                fill="#8b8b8b"/>
                        </svg>}

                    </div>
                </div>
            </form>
        </div>
    );
};

export default PersonalAssessorInfo;