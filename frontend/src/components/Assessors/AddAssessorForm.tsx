import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {Context} from "../../index";
import MyLabel from "../UI/MyLabel";
import MyInput from "../UI/MyInput";
import Error from "../UI/Error";
import Select from "react-select";
import {SelectProps} from "../Projects/ProjectForm";
import {useParams} from "react-router-dom";
import AssessorService from "../../services/AssessorService";

import {AtSymbolIcon} from '@heroicons/react/24/solid';
import {useMutation, useQuery} from "react-query";
import ProjectService from "../../services/ProjectService";


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
// const stateObject = [
//     {value: "available", label: "Доступен"},
//     {value: "busy", label: "Занят"},
//     {value: "free_resource", label: "Свободный ресурс"},
//     {value: "vacation", label: "Отпуск"},
//     {value: "blacklist", label: "Черный список"},
//     {value: "fired", label: "Уволен"}
// ]
const statusObject = [
    {value: "full", label: "Полная загрузка"},
    {value: "partial", label: "Частичная загрузка"},
    {value: "reserved", label: "Зарезервирован"},
]
const AddAssessorForm = ({assessorId, showSidebar, setShowSidebar}: {
        assessorId: number | string | undefined,
        showSidebar: any,
        setShowSidebar: any,
}) => {
    const {store} = useContext(Context)
    const availableProjects = useQuery(['availableProjects'], () => ProjectService.fetchProjects(store.user_id, 1, 'all'), {
        onSuccess: data => setAvailableProjectsList(data.results.map(project => {
            return {label: project.name, value: project.id}
        }))
    })
    const [availableProjectsList, setAvailableProjectsList] = useState<any[]>([])
    const [selectedProjects, setSelectedProjects] = useState<number>()
    const {register, setValue, watch, reset, getValues, formState: {errors}, handleSubmit} = useForm<FormProps>({
        defaultValues: {
            manager: store.user_id,
        }
    })
    const updateAssessorProject = useMutation(['assessors'], ({id, data}:any) => AssessorService.addAssessorProject(id, data), {
        onSuccess: data => {
            if (getValues("status")) createWorkloadStatus.mutate({data:{assessor: data.id, project: getValues('projects'), status: getValues('status')}})
        }
    })
    const createWorkloadStatus = useMutation(['assessors'], ({data}:any) => AssessorService.createWorkloadStatus(data))
    const createAssessor = useMutation(['assessors'], () => AssessorService.addAssessor(getValues()), {
        onSuccess: data => {
            if (getValues("projects")) updateAssessorProject.mutate({id: data.id,data: {projects: [getValues('projects')]}})
        },
        onError: error => console.log(error)
    })
    function submit() {
        const data = getValues('projects')
        console.log(data)
        createAssessor.mutate()
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
        <form onSubmit={handleSubmit(submit)}>
            <FormSection>
                <MyLabel required={true}>Фамилия</MyLabel>
                <MyInput placeholder="Фамилия"
                         type="text"
                         register={{
                             ...register('last_name', {
                                 required: "Обязательное поле",
                                 pattern: {
                                     value: /^[А-ЯЁа-яёA-Za-z]+$/,
                                     message: "Поле должно содержать символы: A-z,А-я"
                                 }
                             })
                         }}/>
                <Error>{errors.last_name && errors.last_name?.message}</Error>
            </FormSection>
            <FormSection>
                <MyLabel required={true}>Иван</MyLabel>
                <MyInput register={{
                    ...register('first_name', {
                        required: "Обязательное поле",
                        pattern: {
                            value: /^[А-ЯЁа-яёA-Za-z]+$/,
                            message: "Поле должно содержать символы: A-z,А-я"
                        }
                    })
                }}
                         type="text"
                         placeholder="Имя"
                />
                <Error>{errors.first_name && errors.first_name?.message}</Error>
            </FormSection>
            <FormSection>
                <MyLabel>Отчество</MyLabel>
                <MyInput register={{
                    ...register('middle_name', {
                        pattern: {
                            value: /^[А-ЯЁа-яёA-Za-z]+$/,
                            message: "Поле должно содержать символы: A-z,А-я"
                        }
                    })
                }} type="text" placeholder="Отчество"
                />
                <Error>{errors.middle_name && errors.middle_name?.message}</Error>
            </FormSection>
            <FormSection>
                <MyLabel required={true}>Ник в ТГ</MyLabel>
                <div className='flex relative items-center'>
                    <AtSymbolIcon className="absolute ml-[10px] h-full w-[18px] text-black border-x-black"/>
                    <MyInput register={{
                        ...register('username', {
                            required: "Обязательное поле",
                            pattern: {
                                value: /^[A-Za-z\d_]{5,32}$/,
                                message: "Никнейм должен содержать символы:A-z, _ Длина: 5-32 символа"
                            }
                        })
                    }} type="text" placeholder="Ник в ТГ"
                    />
                </div>
                <Error>{errors.username && errors.username?.message}</Error>
            </FormSection>
            <FormSection>
                <MyLabel>Проект</MyLabel>
                <Select
                    {...register('projects')}
                    options={availableProjectsList}
                    isSearchable={false}
                    // isDisabled={!!getValues('projects')}
                    value={getValueProjects()}
                    onChange={onChangeProjects}
                />
            </FormSection>
            <FormSection>
                <MyLabel>Статус</MyLabel>
                <Select
                    {...register('status')}
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
                    options={countryObject}
                    value={getValueCountry()}
                    onChange={onChangeCountry}
                />
            </FormSection>
            <FormSection>
                <MyLabel>Почта</MyLabel>
                <MyInput
                    register={{
                        ...register('email', {
                            pattern: {
                                value: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/,
                                message: "Неверно указана почта"
                            },
                        })
                    }}
                    placeholder='Почта'
                    type="text"
                />
                <Error>{errors.email && errors.email?.message}</Error>
            </FormSection>
            <div className="w-full pt-3">
                <button
                    className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                    type="submit">Сохранить
                </button>
            </div>
        </form>
    );
}
;

export default AddAssessorForm;