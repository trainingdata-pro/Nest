import React, {useContext, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import AssessorService from "../services/AssessorService";
import {Project} from "../models/ProjectResponse";
import ProjectService from "../services/ProjectService";
import {Context} from "../index";
import MyLabel from "./UI/MyLabel";
import MyInput from "./UI/MyInput";
import Error from "./UI/Error";
import Select from "react-select";
import {SelectProps} from "./ProjectForm";
import {Assessor} from "../models/AssessorResponse";
import {da} from "date-fns/locale";


interface FormProps {
    last_name: string,
    first_name: string
    middle_name: string,
    username: string,
    project: string,
    status: SelectProps,
    country: string,
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
        const {store} = useContext(Context)
        const {register,setValue, watch, reset, getValues, formState: {errors}, handleSubmit} = useForm<FormProps>()
        const [projects, setProjects] = useState<Project[]>([])
        useEffect(() => {
            ProjectService.fetchProjects(store.managerData.id.toString()).then(res => setProjects(res.data.results.filter(d => d.manager.map(manager => manager.id === store.managerData.id))))
        }, [])
        useEffect(() => {
            reset()
        }, [showSidebar])
        const [serverError, setServerError] = useState({})

        function submit() {
            let data = getValues()
            const requestData2 = {...data, status: data.status.value}
            AssessorService.addAssessor(requestData2).then((res:any) => {
                    setAssessors([...assessors, res.data])
                    setShowSidebar(false)
                }
            ).catch((e: any) => {
                console.log(e)
                const errJson = JSON.parse(e.request.response)
                setServerError(errJson)
            })
        }

        const statusObject = [
            {value: "free", label: "Свободен"},
            {value: "full", label: "Занят"},
            {value: "partial", label: "Частичная загруженность"}

        ]
    const statusList = [
        {value: 'active', label: 'Активный'},
        {value: 'pause', label: 'На паузе'},
        {value: 'completed', label: 'Завершен'}
    ]
        const handleSelectChangeStatus = (value: any) => {
            setValue('status', value);
        };
        return (
            <form onSubmit={handleSubmit(submit)}>
                <FormSection>
                    <MyLabel required={true}>Фамилия</MyLabel>
                    <MyInput placeholder="Фамилия"
                             type="text"
                             register={{
                                 ...register('last_name', {
                                     required: "Обязательное поле"
                                 })
                             }}/>
                    <Error>{errors.last_name && errors.last_name?.message}</Error>
                </FormSection>
                <FormSection>
                    <MyLabel required={true}>Иван</MyLabel>
                    <MyInput register={{
                        ...register('first_name', {
                            required: "Обязательное поле"
                        })
                    }}
                             type="text"
                             placeholder="Имя"
                    />
                    <Error>{errors.first_name && errors.first_name?.message}</Error>
                </FormSection>
                <FormSection>
                    <MyLabel required={true}>Отчество</MyLabel>
                    <MyInput register={{
                        ...register('middle_name', {
                            required: "Обязательное поле"
                        })
                    }} type="text" placeholder="Отчество"
                    />
                    <Error>{errors.middle_name && errors.middle_name?.message}</Error>
                </FormSection>
                <FormSection>
                    <MyLabel required={true}>Ник в ТГ</MyLabel>
                    <MyInput register={{
                        ...register('username', {
                            required: "Обязательное поле"
                        })
                    }} type="text" placeholder="Ник в ТГ"
                    />
                    <Error>{errors.username && errors.username?.message}</Error>
                </FormSection>
                <FormSection>
                    <MyLabel required={true}>Проект</MyLabel>
                    <select {...register('project')}
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    >
                        <option value=''>------------</option>
                        {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                    </select>
                </FormSection>
                <FormSection>
                    <MyLabel required={true}>Статус</MyLabel>
                    <Select
                        {...register('status', {required: 'Обязательное поле'})}
                        options={statusObject}
                        value={watch('status')}
                        onChange={handleSelectChangeStatus}
                        styles={{
                            control: base => ({
                                ...base,
                                height: 32,
                                minHeight: 32,
                                fontSize: 14
                            }),
                            input: (provided, state) => ({
                                ...provided,
                                padding: '0px',
                            })
                        }}
                    />
                </FormSection>
                <FormSection>
                    <MyLabel required={true}>Страна</MyLabel>
                    <MyInput
                        register={{...register('country', {
                            required: "Обязательное поле"
                        })
                        }}
                        type="text"
                        placeholder="Страна"
                    />
                    <Error>{errors.country && errors.country?.message}</Error>
                </FormSection>
                <FormSection>
                    <MyLabel required={true}>Почта</MyLabel>
                    <MyInput
                        register={{...register('email', {
                            required: "Обязательное поле"
                        })
                        }}
                        placeholder='Почта'
                        type="text"
                    />
                    <Error>{errors.email && errors.email?.message}</Error>
                </FormSection>
                <div className="w-full">
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