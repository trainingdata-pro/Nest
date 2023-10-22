import React, {useContext, useMemo, useRef, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import ManagerService from "../services/ManagerService";
import MyLabel from "./UI/MyLabel";
import MyInput from "./UI/MyInput";
import Select from "react-select";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {errorNotification, successNotification} from "./UI/Notify";
import Error from "./UI/Error";
import {Dialog} from "@headlessui/react";
import MyButton from './UI/MyButton';


interface ProfileProps {
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

const Profile = () => {
    const {store} = useContext(Context)
    const queryClient = useQueryClient()
    const {
        register,
        getValues,
        formState: {
            errors
        },
        setValue,
        handleSubmit
    } = useForm<ProfileProps>()
    const fetchTeamLeads = useQuery(
        ['TeamLeads'],
        () => ManagerService.fetchTeamLeads(),
        {
            onSuccess: data => {
                setOptions(data.data.results.map((TeamLead: any) => {
                    return {label: `${TeamLead.user.last_name} ${TeamLead.user.first_name}`, value: TeamLead.user.id}
                }))
            }
        })

    const [selectedTeamLead, setSelectedTeamLead] = useState<number | string>()
    const fetchManagerInfo = useQuery(
        'currentManager',
        () => ManagerService.fetchManager(store.user_data.profile_id),
        {
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
        return selectedTeamLead ?
            options.find(TeamLead => TeamLead.value.toString() === selectedTeamLead.toString())
            : ''
    }
    const handleChangeTeamLead = (value: any) => {
        setValue('teamlead', value.value)
        setSelectedTeamLead(value.value)
    }
    const patchBaseUser = useMutation(({data}: any) => ManagerService.patchBaseUser(store.user_id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('currentManager')
            successNotification('Информация обновлена')
        },
        onError: () => {
            errorNotification('Ошибка при обновлении данных')
        }
    })
    const patchManagerTeamLead = useMutation(({data}: any) => ManagerService.patchManager(store.user_data.profile_id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('currentManager')
            successNotification('TeamLead обновлен')
        },
        onError: () => {
            errorNotification('Ошибка при обновлении поля TeamLead')
        }
    })
    const close = () => {
        if (!getValues('teamlead') || !fetchManagerInfo.data?.teamlead) {
            errorNotification('Заполните поле TeamLead и нажмите сохранить')
        } else {
            store.setIsOpenProfile(false)
        }
    }
    const onSubmit = (data: ProfileProps) => {
        if (!data.teamlead) {
            errorNotification('Заполните поле TeamLead')
        } else {
            patchBaseUser.mutate({data: data})
            if (!fetchManagerInfo.data?.teamlead){
                patchManagerTeamLead.mutate({data: data})
            }
            store.setIsOpenProfile(false)
        }

    }
    const cancelButtonRef = useRef(null)
    return (
        <>
            <li>
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
                    onClick={() => store.setIsOpenProfile(true)}>Профиль
                </button>
            </li>
            <Dialog
                as="div"
                open={store.isOpenProfile}
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={() => close()
            }>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                <div className="fixed inset-0 z-20 overflow-y-auto">
                    <div className="flex min-h-full justify-center p-4 text-center items-start">
                        <Dialog.Panel
                            className="relative rounded-lg bg-white text-left shadow-xl transition-all max-w-[70%]">
                            <div className="bg-white px-4 pb-4">
                                <div className="text-center" ref={cancelButtonRef}>
                                    <form className="space-y-3 w-[500px]" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="flex h-2 justify-end w-full">
                                            <div className="cursor-pointer text-[18px]" onClick={() => close()}>x</div>
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
                                                isDisabled={!!fetchManagerInfo.data?.teamlead}
                                                options={options}
                                                value={getSelectValues()}
                                                onChange={handleChangeTeamLead}
                                            />
                                        </FormSection>
                                        <FormSection>
                                            <MyLabel required={true}>ID</MyLabel>
                                            <MyInput register={{...register('id')}} type="text" placeholder="ID"
                                                     disabled={true}/>
                                        </FormSection>
                                        <MyButton className='w-full'>Сохранить</MyButton>
                                    </form>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>

                </div>
            </Dialog>
        </>

    )
};

export default observer(Profile);