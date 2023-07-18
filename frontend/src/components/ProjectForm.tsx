import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {Project} from "../store/store";
import ProjectsService from "../services/ProjectsService";
import {Context} from "../index";
import {redirect, useNavigate} from "react-router-dom";
// @ts-ignore
const ProjectForm = ({id, name}) => {
    const navigate = useNavigate();
    const values = {"name": name}
    // const {store} = useContext(Context)
    const {register, getValues, handleSubmit} = useForm<Project>({
            values
    }

    )
    const [status, setStatus] = useState<string>('')
    const onSubmit = async () => {
        const values = getValues()
        console.log(values)
        await ProjectsService.updateProjects(id, values)
            .then(res => {
                setStatus('Проект успешно добавлен')
                navigate('/dashboard/projects/')
                // store.addProject(res.data)
            })
            .catch((e) => setStatus(e.response.data.name[0]))


    }
    return (
        <div>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2"><label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Название</label>
                    <input {...register('name')}
                        className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                        placeholder="Разметка фотографий дорожных знаков"
                        /><p className="text-sm text-muted-foreground">Название вашего нового проекта</p>
                </div>
                <p className="text-sm h-5 text-red-500 text-muted-foreground">{status && status}</p>
                <button
                    className="inline-flex bg-black text-white items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full"
                    type="submit">Сохранить
                </button>
            </form>
        </div>
    );
};

export default ProjectForm;