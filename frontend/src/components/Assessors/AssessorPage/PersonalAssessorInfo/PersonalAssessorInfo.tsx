import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {Context} from "../../../../index";
import {errorNotification} from "../../../UI/Notify";
import {CheckIcon, PencilSquareIcon} from '@heroicons/react/24/outline';
import {DisabledTelegramIcon, EnabledTelegramIcon} from "../../../../assets/TelegramIcon";
import {COUNTRIES} from "../../../../assets/consts";
import Form from "./Form";
import {PersonalTableProps, useFetchAssessorInfo, usePatchAssessorInfo} from "./queries";

const PersonalAssessorInfo = ({assessorId}: { assessorId: string | number | undefined }) => {
    const {
        register,
        setValue,
        getValues,
        handleSubmit
    } = useForm<PersonalTableProps>()
    const [isDisabled, setIsDisabled] = useState(true)

    const assessor = useFetchAssessorInfo({setValue: setValue, assessorId: assessorId})
    const patchAssessorInfo = usePatchAssessorInfo({setIsDisabled: setIsDisabled, assessorId: assessorId})
    const {store} = useContext(Context)
    const setTelegramIcon = (isDisabled: boolean) => {
        if (isDisabled) return (
            <a href={`https://t.me/${getValues('username')}`} target='_blank' rel="noreferrer">
                <EnabledTelegramIcon/>
            </a>
        )
        return <DisabledTelegramIcon/>
    }
    const setButtonIcon = () => {
        if (store.team.find(manager => manager.user.id === assessor.data?.manager?.id) !== undefined ||
            assessor.data?.manager?.id === store.user_id ||
            (store.user_data.is_teamlead && assessor.data?.second_manager.find(man => man.id === store.user_id) !== undefined)) {
            if (isDisabled) {
                return <PencilSquareIcon className="h-6 w-6 text-black cursor-pointer"/>
            }
            return <CheckIcon className="h-6 w-6 text-black cursor-pointer"/>
        } else {
            return <PencilSquareIcon className="h-6 w-6 text-gray-400"/>
        }

    }
    const setDisabledButton = () => {
        if (store.user_data.is_teamlead) {
            return store.team.find(manager => manager.user.id === assessor.data?.manager?.id) === undefined
        }
        return assessor.data?.manager?.id !== store.user_id
    }
    const getData = () => {
        const {manager, ...assessorData} = getValues()
        if (assessorData.email === '') {
            return {...assessorData, email: null}
        } else {
            if (assessorData.email === assessor.data?.email) {
                const {email, ...rest} = assessorData
                return rest
            } else {
                return assessorData
            }
        }
    }
    function Submit() {
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            const data = getData()
            if (!/^[A-Za-z\d_]{5,32}$/.test(data.username)) {
                errorNotification('Ник в ТГ: Доступные символы:A-z,0-9,_ Длина: 5-32 символа')
                return
            }
            patchAssessorInfo.mutate({id: assessorId, data: data})

        }
    }

    return (
        <div className="z-0 rounded-[20px] overflow-hidden">
            <Form handleSubmit={handleSubmit} submit={Submit}>
                <Form.FormCell name={'Фамилия'} isLoading={assessor.isLoading}>
                    <Form.FormInput isDisabled={isDisabled} register={{...register('last_name')}}/>
                </Form.FormCell>
                <Form.FormCell name={'Имя'} isLoading={assessor.isLoading}>
                    <Form.FormInput isDisabled={isDisabled} register={{...register('first_name')}}/>
                </Form.FormCell>
                <Form.FormCell name={'Отчество'} isLoading={assessor.isLoading}>
                    <Form.FormInput isDisabled={isDisabled} register={{...register('middle_name')}}/>
                </Form.FormCell>
                <Form.FormCell name={'Ник в ТГ'} isLoading={assessor.isLoading}>
                    <Form.FormInput isDisabled={isDisabled} register={{...register('username')}}/>
                </Form.FormCell>
                <Form.FormCell name={'Менеджер'} isLoading={assessor.isLoading}>
                    <Form.FormInput isDisabled={true} register={{...register('manager')}}/>
                </Form.FormCell>
                <Form.FormCell name={'Почта'} isLoading={assessor.isLoading}>
                    <Form.FormInput isDisabled={isDisabled} register={{...register('email')}}/>
                </Form.FormCell>
                <Form.FormCell name={'Страна'} isLoading={assessor.isLoading}>
                    <select className='w-full text-center' disabled={isDisabled} {...register('country')}>
                        <option disabled></option>
                        {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
                    </select>
                </Form.FormCell>
                <div className='flex flex-col justify-between py-3'>
                    <button disabled={setDisabledButton()} className='px-[7px]'>
                        {setButtonIcon()}
                    </button>
                    <div>{setTelegramIcon(isDisabled)}</div>
                </div>
            </Form>
        </div>
    );
};

export default PersonalAssessorInfo;