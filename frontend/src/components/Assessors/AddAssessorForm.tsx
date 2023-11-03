import React, {useContext, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {Context} from "../../index";
import MyLabel from "../UI/MyLabel";
import MyInput from "../UI/MyInput";
import Error from "../UI/Error";
import Select from "react-select";
import AssessorService from "../../services/AssessorService";

import {AtSymbolIcon} from '@heroicons/react/24/solid';
import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../services/ProjectService";
import {errorNotification, successNotification} from "../UI/Notify";
import MyButton from "../UI/MyButton";


interface FormProps {
    last_name: string,
    first_name: string
    middle_name: string,
    username: string,
    projects: number,
    manager: number,
    status: string,
    country: string,
    email: string
}

const FormSection = ({children}: { children: React.ReactNode }) => {
    return <div className="mb-2">{children}</div>
}
const countryObject = [
    {label: "РФ", value: "РФ"},
    {label: "РБ", value: "РБ"},
    {label: "ПМР", value: "ПМР"},
    {label: "Другое", value: "Другое"},
]

const statusObject = [
    {value: "full", label: "Полная загрузка"},
    {value: "partial", label: "Частичная загрузка"},
    {value: "reserved", label: "Зарезервирован"},
]
const AddAssessorForm = ({assessorId,project, setShowSidebar}: {
        assessorId: number | string | undefined,
        setShowSidebar: any,
        project: any
    }) => {
        const {store} = useContext(Context)
        const queryClient = useQueryClient()
        const availableProjects = useQuery(['availableProjects'], () => ProjectService.fetchProjects(1, ''), {
            onSuccess: data => {
                setAvailableProjectsList(data.results.map(project => {
                        return {label: project.name, value: project.id}
                    }
                ))
            }
        })

        const [availableProjectsList, setAvailableProjectsList] = useState<any[]>([])
        const [selectedProjects, setSelectedProjects] = useState<number>()
        const {register, setValue, watch, reset, getValues, formState: {errors}, handleSubmit} = useForm<FormProps>({
            defaultValues: {
                manager: store.user_id,
                projects: project?.id
            }
        })
        const updateAssessorProject = useMutation(['projectAssessors',], ({
                                                                              id,
                                                                              data
                                                                          }: any) => AssessorService.addAssessorProject(id, data), {
            onSuccess: data => {
                if (getValues("status")) createWorkloadStatus.mutate({
                    data: {
                        assessor: data.id,
                        project: getValues('projects'),
                        status: getValues('status')
                    }
                })
                queryClient.invalidateQueries('projectAssessors')
                queryClient.invalidateQueries('assessors')
                successNotification('Ассессор успешно назначен на проект')
                setShowSidebar(false)
            },
            onError: (error:any) => {
                const jsonError = JSON.parse(error.request.responseText)
                errorNotification(jsonError[Object.keys(jsonError)[0]][0])
            }
        })
        const createWorkloadStatus = useMutation(['projectAssessors'], ({data}: any) => AssessorService.createWorkloadStatus(data), {
            onSuccess: () => {
                queryClient.invalidateQueries('projectAssessors')
                queryClient.invalidateQueries('assessors')
                successNotification('Ассессору успешно присвоен статус')
                setShowSidebar(false)
            },
            onError: (error:any) => {
                const jsonError = JSON.parse(error.request.responseText)
                errorNotification(jsonError[Object.keys(jsonError)[0]][0])}

        })
        const createAssessor = useMutation(['projectAssessors'], ({data}:any) => AssessorService.addAssessor(data), {
            onSuccess: data => {
                if (getValues("projects")) updateAssessorProject.mutate({
                    id: data.id,
                    data: {projects: [getValues('projects')]}
                })
                queryClient.invalidateQueries('projectAssessors')
                queryClient.invalidateQueries('assessors')
                successNotification('Ассессор успешно создан')
                setShowSidebar(false)
            },
            onError: (error:any) => {
                const jsonError = JSON.parse(error.request.responseText)
                errorNotification(jsonError[Object.keys(jsonError)[0]][0])
            }
        })

        function submit() {
            const data = getValues()
            // console.log(data)
            if (getValues('email')) {
                createAssessor.mutate({data: data})
            } else {
                const {email, ...rest} = data
                createAssessor.mutate({data: rest})
            }

        }

        const onChangeProjects = (newValue: any) => {
            setSelectedProjects(newValue.value)
            setValue('projects', newValue.value)

        }
        const [currentStatus, setCurrentStatus] = useState<string>()
        const [currentCountry, setCurrentCountry] = useState<string>('')
        const getValueProjects = () => {
            return selectedProjects ? availableProjectsList.find(p => p.value === selectedProjects) : ''
        }
        const onChangeStatus = (newValue: any) => {
            setCurrentStatus(newValue.value)
            setValue('status', newValue.value)
        }
        const getValueStatus = () => {
            return currentStatus ? statusObject.find(s => s.value === currentStatus) : ''
        }
        const onChangeCountry = (newValue: any) => {
            setCurrentCountry(newValue.value)
            setValue('country', newValue.value)
        }
        const getValueCountry = () => {
            return currentCountry ? countryObject.find(c => c.value === currentCountry) : ''
        }
        return (
            <form className='min-w-[30rem] pt-4' onSubmit={handleSubmit(submit)}>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel required={true}>Фамилия</MyLabel>
                        <Error>{errors.last_name && errors.last_name?.message}</Error>
                    </div>
                    <MyInput placeholder="Фамилия"
                             type="text"
                             className={'pl-[12px]'}
                             register={{
                                 ...register('last_name', {
                                     required: "Обязательное поле",
                                     pattern: {
                                         value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                         message: "Поле должно содержать символы: A-z,А-я"
                                     }
                                 })
                             }}/>

                </FormSection>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel required={true}>Имя</MyLabel>
                        <Error>{errors.first_name && errors.first_name?.message}</Error>
                    </div>
                    <MyInput register={{
                        ...register('first_name', {
                            required: "Обязательное поле",
                            pattern: {
                                value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                message: "Поле должно содержать символы: A-z,А-я"
                            }
                        })
                    }}
                             className={'pl-[12px]'}
                             type="text"
                             placeholder="Имя"
                    />

                </FormSection>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel>Отчество</MyLabel>
                        <Error>{errors.middle_name && errors.middle_name?.message}</Error>
                    </div>
                    <MyInput register={{
                        ...register('middle_name', {
                            pattern: {
                                value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                message: "Поле должно содержать символы: A-z,А-я"
                            }
                        })
                    }} className={'pl-[12px]'} type="text" placeholder="Отчество"
                    />

                </FormSection>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel required={true}>Ник в ТГ</MyLabel>
                        <Error>{errors.username && errors.username?.message}</Error>
                    </div>
                    <div className='flex relative items-center'>
                        <AtSymbolIcon className="absolute ml-[10px] h-full w-[18px] text-black border-x-black"/>
                        <MyInput register={{
                            ...register('username', {
                                required: "Обязательное поле",
                                pattern: {
                                    value: /^[A-Za-z\d_]{5,32}$/,
                                    message: "Доступные символы:A-z,0-9,_ Длина: 5-32 символа"
                                }
                            })
                        }} type="text" placeholder="Ник в ТГ" className='pl-[32px]'
                        />
                    </div>

                </FormSection>
                <FormSection>
                    <MyLabel>Проект</MyLabel>
                    <Select
                        {...register('projects')}
                        className='text-start'
                        options={availableProjectsList}
                        isSearchable={false}
                        isDisabled={!!project}
                        value={project ? {label: project.name, value: project.id}: getValueProjects() }
                        onChange={onChangeProjects}
                    />
                </FormSection>
                <FormSection>
                    <MyLabel>Статус</MyLabel>
                    <Select
                        {...register('status')}
                        className='text-start'
                        isDisabled={!getValues('projects')}
                        options={statusObject}
                        value={getValueStatus()}
                        onChange={onChangeStatus}
                    />
                </FormSection>
                <FormSection>
                    <MyLabel>Страна</MyLabel>
                    <Select
                        {...register('country')}
                        className='text-start'
                        options={countryObject}
                        value={getValueCountry()}
                        onChange={onChangeCountry}
                    />
                </FormSection>
                <FormSection>
                    <div className='flex justify-between'>
                        <MyLabel>Почта</MyLabel>
                        <Error>{errors.email && errors.email?.message}</Error>
                    </div>
                    <MyInput
                        register={{
                            ...register('email', {
                                pattern: {
                                    value: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/,
                                    message: "Неверно указана почта"
                                },
                            })
                        }}
                        className={'pl-[12px]'}
                        placeholder='Почта'
                        type="text"
                    />

                </FormSection>
                <div className="flex justify-between pt-3 space-x-2">
                    <MyButton onClick={() => setShowSidebar(false)}>Назад</MyButton>
                    <MyButton>Сохранить</MyButton>
                </div>
            </form>
        );
    }
;

export default AddAssessorForm;