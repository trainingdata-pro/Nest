import React, {useContext, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import ProjectService from "../../services/ProjectService";
import {Context} from "../../index";
import MyLabel from "../UI/MyLabel";
import MyInput from "../UI/MyInput";
import Error from "../UI/Error";
import Select from "react-select";
import {SelectProps} from "../ProjectForm";
import {useLocation, useParams} from "react-router-dom";
import AssessorService from "../../services/AssessorService";
import {Project} from "../../models/ProjectResponse";
import { AtSymbolIcon } from '@heroicons/react/24/solid';


interface FormProps {
    last_name: string,
    first_name: string
    middle_name: string,
    username: string,
    projects: SelectProps,
    manager: number,
    status: SelectProps,
    country: SelectProps,
    email: string
}

const FormSection = ({children}: { children: React.ReactNode }) => {
    return <div className="mb-2">{children}</div>
}

const AddAssessorForm = ({assessors, setAssessors, showSidebar, setShowSidebar}: {
        assessors: any,
        setAssessors: any,
        showSidebar: any,
        setShowSidebar: any,
    }) => {

        const countryObject = [
            {label: "РФ", value: "РФ"},
            {label: "РБ", value: "РБ"},
            {label: "ПМР", value: "ПМР"},
            {label: "Другое", value: "Другое"},

        ]
        const {store} = useContext(Context)

        const {id} = useParams()
        useEffect(() => {
            ProjectService.fetchProjects(store.user_id.toString()).then(res => {
                setProjects(res.data.results.filter(d => d.manager.map(manager => manager.id === store.user_id)).map(result => {
                    return {value: result.id, label: result.name}
                }))
                if (id) {
                    const currentProject = res.data.results.filter(project => project.id.toString() === id)[0]
                    setValue('projects', {label: currentProject.name, value: currentProject.id})
                }


            })
        }, [])
        const {register, setValue, watch, reset, getValues, formState: {errors}, handleSubmit} = useForm<FormProps>({
            defaultValues: {
                manager: store.user_id,
            }
        })

        const [projects, setProjects] = useState<SelectProps[]>([])
        const [serverError, setServerError] = useState([])

        function submit(data:FormProps) {
            const requestData1 = {...data, country: data.country?.value}
            const requestData2 = {...requestData1, status: data.status?.value}
            const requestData3 = {...requestData2, projects: data.projects?.value.toString()}
            console.log(requestData3)
            AssessorService.addAssessor(requestData3).then((res: any) => {
                    if (data.projects){
                        AssessorService.addAssessorProject(res.data.id, [requestData3.projects]).then(res => console.log(res.data))
                        setAssessors([...assessors, res.data])
                    }


                    setShowSidebar(false)
                }
            ).catch((e: any) => {
                const errJson = JSON.parse(e.request.response)
                setServerError(errJson)
            })


        }

        const stateObject = [
            {value: "available", label: "Доступен"},
            {value: "busy", label: "Занят"},
            {value: "free_resource", label: "Свободный ресурс"},
            {value: "vacation", label: "Отпуск"},
            {value: "blacklist", label: "Черный список"},
            {value: "fired", label: "Уволен"}
        ]
        const statusObject = [
            {value: "full", label: "Полная загрузка"},
            {value: "partial", label: "Частичная загрузка"},
            {value: "reserved", label: "Зарезервирован"},
        ]
        const handleSelectChangeStatus = (value: any) => {
            setValue('status', value);
        };
        const handleSelectChangeProject = (value: any) => {
            setValue('projects', value);
        };
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
                    <AtSymbolIcon className="absolute ml-[10px] h-full w-[18px] text-black border-x-black" />
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
                        options={projects}
                        isDisabled={!!getValues('projects')}
                        value={watch('projects')}
                        onChange={handleSelectChangeProject}
                    />
                </FormSection>
                <FormSection>
                    <MyLabel>Статус</MyLabel>
                    <Select
                        {...register('status')}
                        isDisabled={!getValues('projects')}
                        options={statusObject}
                        value={watch('status')}
                        onChange={handleSelectChangeStatus}
                    />
                </FormSection>
                <FormSection>
                    <MyLabel>Страна</MyLabel>
                    <Select
                        {...register('country')}
                        options={countryObject}
                        value={watch('country')}
                        onChange={handleSelectChangeStatus}
                    />
                </FormSection>
                <FormSection>
                    <MyLabel>Почта</MyLabel>
                    <MyInput
                        register={{
                            ...register('email', {
                                pattern: {
                                    value: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}$/,
                                    message: "Укажите корпоративную почту"
                                },
                            })
                        }}
                        placeholder='Почта'
                        type="text"
                    />
                    <Error>{errors.email && errors.email?.message}</Error>
                </FormSection>
                <FormSection>
                    {Object.keys(serverError).map((key: any) => <Error>{serverError[key]}</Error>)}
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