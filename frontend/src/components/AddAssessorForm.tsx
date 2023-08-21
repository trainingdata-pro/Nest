import React, {useContext, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import AssessorService from "../services/AssessorService";
import {Project} from "../models/ProjectResponse";
import ProjectService from "../services/ProjectService";
import {Context} from "../index";


interface FormProps {
    last_name: string,
    first_name: string
    middle_name: string,
    username: string,
    project: string,
    status: string,
    country: string,
    email: string
}

// @ts-ignore
const AddAssessorForm = ({assessors,setAssessors, showSidebar, setShowSidebar}) => {
    const {store} = useContext(Context)
    const {register, reset, getValues,formState:{errors}, handleSubmit} = useForm<FormProps>()
    const [projects, setProjects] = useState<Project[]>([])
    useEffect(() => {
      ProjectService.fetchProjects(store.managerData.id.toString()).then(res => setProjects(res.data.results.filter(d => d.manager.map(manager => manager.id === store.managerData.id))))
    }, [])
    useEffect(()=>{
        reset()
    },[showSidebar])
    const [serverError, setServerError] = useState({})
    function submit() {
        AssessorService.addAssessor(getValues()).then((res:any) => {
                setAssessors([...assessors, res.data])
                setShowSidebar(false)
            }
        ).catch((e:any) => {
            const errJson = JSON.parse(e.request.response)
            setServerError(errJson)
        })
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="">
                <label>Фамилия</label>
                <input {...register('last_name', {
                    required:"Обязательное поле"
                })}
                       className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                />
                <p className='h-4 text-red-500 text-sm'>{errors.last_name && errors.last_name?.message}</p>
            </div>
            <div className="my-2">
                <label>Имя</label>
                <input {...register('first_name', {
                    required:"Обязательное поле"
                })}
                       className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                />
                <p className='h-4 text-red-500 text-sm'>{errors.first_name && errors.first_name?.message}</p>
            </div>
            <div className="my-2">
                <label>Отчество</label>
                <input {...register('middle_name', {
                    required:"Обязательное поле"
                })}
                       className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                />
                <p className='h-4 text-red-500 text-sm'>{errors.middle_name && errors.middle_name?.message}</p>
            </div>
            <div className="my-2">
                <label>Ник в ТГ</label>
                <input {...register('username', {
                    required:"Обязательное поле"
                })}
                       className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                />
                <p className='h-4 text-red-500 text-sm'>{errors.username && errors.username?.message}</p>
            </div>
            <div className="my-2">
                <label>Проект</label>
                <select {...register('project')}
                       className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                >
                    <option value=''>------------</option>
                    {projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
            </div>
            <div className="my-2">
                <label>Статус</label>
                <select {...register('status')}
                       className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                >   <option value="">------------</option>
                    <option value="free">Свободен</option>
                    <option value="full">Занят</option>
                    <option value="partial">Частичная загруженность</option>

                </select>
            </div>
            <div className="my-2">
                <label>Страна</label>
                <input {...register('country', {
                    required:"Обязательное поле"
                })}
                       className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                />
                <p className='h-4 text-red-500 text-sm'>{errors.country && errors.country?.message}</p>
            </div>
            <div className="my-2">
                <label>Почта</label>
                <input {...register('email', {
                    required:"Обязательное поле"
                })}
                       className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                />
                <p className='h-4 text-red-500 text-sm'>{errors.email && errors.email?.message}</p>
            </div>
            <div className="w-full">
                <button
                    className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                    type="submit">Сохранить
                </button>
            </div>
        </form>
    );
};

export default AddAssessorForm;