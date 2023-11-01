import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import AssessorService from "../../../services/AssessorService";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Context} from "../../../index";
import {errorNotification, successNotification} from "../../UI/Notify";
import MiniLoader from '../../UI/MiniLoader';
import {CheckIcon, PencilSquareIcon} from '@heroicons/react/24/outline';
import {AxiosError} from "axios";
const  Errors = {
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
        <div className={`flex flex-col border-r border-black ${name === 'Страна' ? 'basis-1/12': 'basis-2/12'}`}>
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
    const patchAssessorInfo = useMutation(['currentAssessorInfo', assessorId], ({id, data}: any) => AssessorService.patchAssessor(id, data), {
        onError: (error: AxiosError) => {
            const errors= error.response?.data ? error.response?.data : {}
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
                {store.user_data.is_teamlead ? <button disabled={store.team.find(manager => manager.user.id === assessor.data?.manager?.id) === undefined} className='px-[7px]'>{

                    store.team.find(manager => manager.user.id === assessor.data?.manager?.id) !== undefined ? (isDisabled ?
                            <PencilSquareIcon className="h-6 w-6 text-black cursor-pointer"/> :
                            <CheckIcon className="h-6 w-6 text-black cursor-pointer"/>) :
                        <PencilSquareIcon className="h-6 w-6 text-gray-400"/>
                }</button> :
                <button className='px-[7px]' disabled={assessor.data?.manager?.id !== store.user_id}>{
                    assessor.data?.manager?.id === store.user_id|| (store.user_data.is_teamlead && assessor.data?.second_manager.find(man => man.id === store.user_id) !== undefined) ?
                        (isDisabled ?
                            <PencilSquareIcon className="h-6 w-6 text-black cursor-pointer"/> :
                            <CheckIcon className="h-6 w-6 text-black cursor-pointer"/>) :
                        <PencilSquareIcon className="h-6 w-6 text-gray-400"/>
                }</button>}
            </div>
            </form>
        </div>
    );
};

export default PersonalAssessorInfo;