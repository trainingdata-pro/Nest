import React, {useContext, useMemo, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import ManagerService from "../services/ManagerService";
import MyLabel from "./UI/MyLabel";
import MyInput from "./UI/MyInput";
import Select from "react-select";
import {useMutation, useQuery} from "react-query";
import {errorNotification, successNotification} from "./UI/Notify";
import Error from "./UI/Error";


interface FormProps {
    last_name: string,
    first_name: string,
    middle_name: string,
    username: string,
    id: number | string,
    teamlead: number | string
}

const FormSection = ({children}: { children: React.ReactNode }) => {
    return (<div className="text-left">{children}</div>)
}
const Profile = ({setIsOpen}: {
    setIsOpen: any
}) => {
    const {store} = useContext(Context)
    const {
        register, formState: {
            errors
        }, setValue, handleSubmit
    } = useForm<FormProps>()
    const fetchTeamLeads = useQuery(['TeamLeads'], () => ManagerService.fetchTeamLeads(), {
        onSuccess: data => {
            setOptions(data.data.results.map((TeamLead: any) => {
                return {label: `${TeamLead.user.last_name} ${TeamLead.user.first_name}`, value: TeamLead.user.id}
            }))
        }
    })
    const [selectedTeamLead, setSelectedTeamLead] = useState<number | string>()
    const fetchManagerInfo = useQuery('currentManager', () => ManagerService.fetchManager(store.user_data.profile_id), {
        onSuccess: data => {
            setValue('id', data.user.id)
            setValue('last_name', data.user.last_name)
            setValue('first_name', data.user.first_name)
            setValue('middle_name', data.user.middle_name)
            setValue('username', data.user.username)
            setValue('teamlead', data.teamlead?.id)
            setSelectedTeamLead(data.teamlead?.id)
        },
    })
    const [options, setOptions] = useState<{ label: string, value: string | number }[]>([])
    const getSelectValues = () => {
        return selectedTeamLead ? options.find(TeamLead => TeamLead.value.toString() === selectedTeamLead.toString()) : ''
    }
    const handleChangeTeamLead = (value: any) => {
        setValue('teamlead', value.value)
        setSelectedTeamLead(value.value)
    }
    const patchBaseUser = useMutation(({data}: any) => ManagerService.patchBaseUser(store.user_id, data), {
        onSuccess: () => {
            successNotification('Информация обновлена')
        },
        onError: () => {
            errorNotification('Ошибка при обновлении данных')
        }
    })
    const patchManagerTeamLead = useMutation(({data}: any) => ManagerService.patchManager(store.user_data.profile_id, data), {
        onSuccess: () => {
            successNotification('TeamLead осбновлен')
        },
        onError: () => {
            errorNotification('Ошибка при обновлении поля TeamLead')
        }
    })

    const onSubmit = (data: FormProps) => {
        patchBaseUser.mutate({data: data})
        patchManagerTeamLead.mutate({data: data})
    }

    return (
        <form className="space-y-3 w-[500px]" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex h-2 justify-end w-full">
                <div className="cursor-pointer" onClick={() => setIsOpen(false)}>x</div>
            </div>
            <FormSection>
                <div className="flex justify-between">
                    <MyLabel required={true}>Фамилия</MyLabel>
                    <Error>{errors.last_name?.message}</Error>
                </div>
                <MyInput autoComplete="new-last_name" register={{
                    ...register('last_name', {
                        pattern: {
                            value: /^[А-ЯЁа-яёA-Za-z]+$/,
                            message: "Поле должно содержать символы: A-z,А-я"
                        },
                        required: {
                            value: true,
                            message: 'Обязательное поле'
                        }
                    })
                }} type="text" placeholder="Фамилия" className='pl-[10px]'/>

            </FormSection>
            <FormSection>
                <div className="flex justify-between">
                    <MyLabel required={true}>Имя</MyLabel>
                    <Error>{errors.first_name?.message}</Error>
                </div>
                <MyInput autoComplete="new-first_name" register={{
                    ...register('first_name', {
                        pattern: {
                            value: /^[А-ЯЁа-яёA-Za-z]+$/,
                            message: "Поле должно содержать символы: A-z,А-я"
                        },
                        required: {
                            value: true,
                            message: 'Обязательное поле'
                        }
                    })
                }} type="text" placeholder="Имя" className='pl-[10px]'/>
            </FormSection>
            <FormSection>
                <div className="flex justify-between">
                    <MyLabel required={false}>Отчество</MyLabel>
                    <Error>{errors.middle_name?.message}</Error>

                </div>
                <MyInput register={{
                    ...register('middle_name', {
                        pattern: {
                            value: /^[А-ЯЁа-яёA-Za-z]+$/,
                            message: "Поле должно содержать символы: A-z,А-я"
                        },
                    })
                }} type="text" placeholder="Отчество" className='pl-[10px]'/>
            </FormSection>
            <FormSection>
                <div className="flex justify-between">
                    <MyLabel required={true}>Ник в ТГ</MyLabel>
                    <Error>{errors.username?.message}</Error>

                </div>
                <MyInput register={{
                    ...register('username', {
                        pattern: {
                            value: /^[A-Za-z\d_]{5,32}$/,
                            message: "Допустимы символы: A-z, _ Длина: 5-32 символа"
                        },
                        required: {
                            value: true,
                            message: 'Обязательное поле'
                        }
                    })
                }} type="text" placeholder="Ник в ТГ" className='pl-[10px]'/>
            </FormSection>
            <FormSection>
                <div className="flex justify-between">
                    <MyLabel required={true}>TeamLead</MyLabel>
                    <Error>{errors.teamlead?.message}</Error>
                </div>
                <Select
                    {...register('teamlead', {
                        required: {
                            value: true,
                            message: 'Обязательное поле'
                        }
                    })}
                    options={options}
                    value={getSelectValues()}
                    onChange={handleChangeTeamLead}
                />
            </FormSection>
            <FormSection>
                <MyLabel required={true}>ID</MyLabel>
                <MyInput register={{...register('id')}} type="text" placeholder="ID" disabled={true}/>
            </FormSection>
            <button
                className="bg-[#5970F6] text-white rounded-md w-full text-sm font-medium disabled:opacity-30 transition-colors hover:bg-primary/90 h-10 mt-4 py-2 px-4">Сохранить
            </button>

        </form>
    );
};

export default observer(Profile);