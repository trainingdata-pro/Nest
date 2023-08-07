import React, {FC, useContext, useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form'
import ProjectService from "../services/ProjectService";
import {Context} from "../index";
import {ManagerData} from "../store/store";
import ManagerService from '../services/ManagerService';
import Select from "react-select";
import {useNavigate, useParams} from "react-router-dom";
import {Project} from "../models/ProjectResponse";
import MyInput from "./UI/MyInput";
import { format } from 'date-fns';
import { Calendar } from 'primereact/calendar';
export interface AddProjectProps {
    manager: number[],
    backlog: string,
    name: string,
    speed_per_hour: number,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: number,
    status: string,
    date_of_creation: string,
    asana_id: number
}


// @ts-ignore
const ProjectForm = ({projectData}) => {
    const {store} = useContext(Context)

    const [project, setProject] = useState<Project>({...projectData})
    const [managers, setManagers] = useState<any[]>([])
    const statusList = [
        {"value": 'active', "label": 'Активный'},
        {"value": 'pause', "label": 'На паузе'},
        {"value": 'completed', "label": 'Завершен'}
    ]
    useEffect(() => {
        ManagerService.fetch_managers().then((res: any) => {
            console.log(res.data.results)
            setManagers(res.data.results)
        })
        setProject(projectData)
    }, [])

    function onSubmit(e: any) {
        const projectData:any = {...project, manager: project.manager.map(manager => manager.id)}
        e.preventDefault()
        if (project.id === 0) {
            console.log(projectData)
            ProjectService.addProject(projectData).then(() => {
                navigation(-1)
            })
        } else {
            ProjectService.patchProject(project.id, projectData).then(() => {
                navigation(-1)
            })
        }
    }

    const navigation = useNavigate()
    // @ts-ignore
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="animate-in fade-in fixed inset-0 z-50 bg-white backdrop-blur-sm transition-opacity"></div>
            <div className="bg-white fixed z-50 w-full max-w-lg border bg-background p-6 opacity-100">
                <form className="grid columns-1">
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Название проекта <span className="text-red-700">*</span></label>
                        <MyInput
                            value={project.name}
                            onChange={(e: any) => setProject({...project, name: e.target.value})}
                            required={true}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="asana_id">Asana ID <span className="text-red-700">*</span></label>
                        <MyInput
                            value={project.asana_id}
                            onChange={(e: any) => setProject({...project, asana_id: e.target.value})}
                            required={true}
                        />
                    </div>
                    <div className="mb-2">
                        <label>Менеджер проекта <span className="text-red-700">*</span></label>

                        <Select
                            options={managers.map(manager => ({
                                "value": manager.id,
                                "label": `${manager.last_name} ${manager.first_name}`
                            }))}
                            value={project.manager.map((manager)=>({
                                "value": manager.id,
                                "label": `${manager.last_name} ${manager.first_name}`
                            }))}
                            onChange={(e: any) => {
                                const managersIds = e.map((v:any) => v.value)
                                setProject({...project, manager: managers.filter((manager) => managersIds.includes(manager.id))})

                            }}
                            isMulti

                        />


                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Скорость в час</label>
                        <MyInput
                            value={project.speed_per_hour ? project.speed_per_hour : 0}
                            onChange={(e: any) => setProject({...project, speed_per_hour: e.target.value})}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Цена за единицу для ассесора</label>
                        <MyInput
                            value={project.price_for_assessor ? project.price_for_assessor : 0}
                            onChange={(e: any) => setProject({...project, price_for_assessor: e.target.value})}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Цена за единицу для заказчика</label>
                        <MyInput
                            value={project.price_for_costumer ? project.price_for_costumer : 0}
                            onChange={(e: any) => setProject({...project, price_for_costumer: e.target.value})}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Объем выгрузок</label>
                        <MyInput
                            value={project.unloading_value ? project.unloading_value : 0}
                            onChange={(e: any) => setProject({...project, unloading_value: e.target.value})}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Регулярность выгрузок</label>
                        <MyInput
                            value={project.unloading_regularity ? project.unloading_regularity : 0}
                            onChange={(e: any) => setProject({...project, unloading_regularity: e.target.value})}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Статус проекта <span className="text-red-700">*</span></label>
                        <Select
                            options={statusList}

                            onChange={(e) => {
                                // @ts-ignore
                                setProject({...project, status: e.value})
                            }}
                            defaultValue={statusList.filter(status => status.value === project.status)}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Дата старта проекта</label>
                        <MyInput
                            value={project.date_of_creation ? project.date_of_creation : format(new Date(), 'yyyy-MM-dd')}
                            onChange={(e: any) => {
                                console.log(e.target.value)
                                setProject({...project, date_of_creation: e.target.value})
                            }}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="button" onClick={(event) => {
                            event.preventDefault()
                            navigation(-1)
                        }} className="bg-black text-white rounded-md px-2 py-2">Назад
                        </button>
                        <button type="submit" onClick={onSubmit}
                                className="bg-black text-white rounded-md px-2 py-2">{project.id === 0 ? 'Добавить' : 'Сохранить'}
                        </button>
                    </div>

                </form>
            </div>

        </div>
    );
}
export default ProjectForm;