import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Project} from "../store/store";
import ProjectsService from "../services/ProjectsService";
import AssessorsService from "../services/AssessorsService";

// @ts-ignore
const AssessorForm = ({id, assessor}) => {
    const navigate = useNavigate();
    const values = {
        "username": assessor.username,
        'last_name': assessor.last_name,
        'first_name': assessor.first_name,
        'middle_name': assessor.middle_name
    }
    // const {store} = useContext(Context)
    const {
        register,
        getValues,
        handleSubmit
    } = useForm({
            values
        }
    )
    const [status, setStatus] = useState<string>('')
    const onSubmit = async () => {
        const values = getValues()
        await AssessorsService.updateCurrentAssessors(id, values)
            .then(res => {
                setStatus('Информация и разметчике успешно обновлена')
                navigate('/dashboard/team/')
            })
            .catch((e) => setStatus(e.response.data.username[0]))



    }
    return (
        <div>
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Телеграм</label>
                    <input {...register('username')}
                           className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                           placeholder="Разметка фотографий дорожных знаков"
                    />
                </div>
                <p className="text-sm h-5 text-red-500 text-muted-foreground">{status && status}</p>
                <section className="grid grid-cols-3 gap-x-4">
                    <div className="space-y-2 col-span-1">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Фамилия </label>
                        <input {...register("last_name")}
                               className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                               placeholder="Пупкин"/>
                    </div>
                    <div className="space-y-2 col-span-1">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Имя </label>
                        <input {...register("first_name")}
                               className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                               placeholder="Василий"/>
                    </div>
                    <div className="space-y-2 col-span-1">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Отчество </label>
                        <input {...register("middle_name")}
                               className="flex h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-white"
                               placeholder="Петрович"/>
                    </div>
                </section>
                <button
                    className="inline-flex bg-black text-white items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full"
                    type="submit">Сохранить
                </button>
            </form>
        </div>
    );
};


export default AssessorForm;