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
import {format} from 'date-fns';
import {Calendar} from 'primereact/calendar';
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;
import {IManager} from "../models/ManagerResponse";
import {observer} from "mobx-react-lite";


// @ts-ignore
const ProjectForm = ({projectId, setNewData, closeSidebar}) => {
    const {store} = useContext(Context)

    const [project, setProject] = useState<Project>({
            id: 0,
            name: '',
            manager: [],
            assessors_count: 0,
            backlog: '',
            asana_id: 0,
            speed_per_hour: 0,
            price_for_assessor: 0,
            price_for_costumer: 0,
            unloading_value: 0,
            unloading_regularity: 0,
            status: '',
            tag: [],
            date_of_creation: ''
        }
    )
    const [managers, setManagers] = useState<any[]>([])
    const statusList = [
        {"value": 'active', "label": 'Активный'},
        {"value": 'pause', "label": 'На паузе'},
        {"value": 'completed', "label": 'Завершен'}
    ]
    useEffect(() => {
        ManagerService.fetch_managers().then((res: any) => {
            setManagers(res.data.results)
        })
        if (projectId){
        if(projectId!==0){
            ProjectService.fetchProject(projectId).then(res => setProject(res.data))
        } else{
            setProject({
                id: 0,
                name: '',
                manager: [],
                assessors_count: 0,
                backlog: '',
                asana_id: 0,
                speed_per_hour: 0,
                price_for_assessor: 0,
                price_for_costumer: 0,
                unloading_value: 0,
                unloading_regularity: 0,
                status: '',
                tag: [],
                date_of_creation: format(new Date(), 'yyyy-MM-dd')
            })
        }}
    }, [projectId])

    async function onSubmit(e: any) {
        const projectData: any = {...project, manager: project.manager.map(manager => manager.id)}
        e.preventDefault()
        if (project.id === 0) {
            await ProjectService.addProject(projectData).then(() => {
                closeSidebar(false)
            })
            await ProjectService.fetchProjects(store.managerData.id.toString()).then(res => {
                setNewData(res.data.results.filter(project => project.status !== 'completed'))
            })
        } else {
            await ProjectService.patchProject(project.id, projectData).then(() => {
                closeSidebar(false)
            })
            await ProjectService.fetchProjects(store.managerData.id.toString()).then(res => {
                setNewData(res.data.results.filter(project => project.status !== 'completed'))
            })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className={"w-[90%]"}>
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
                            value={project.manager.map((manager) => ({
                                "value": manager.id,
                                "label": `${manager.last_name} ${manager.first_name}`
                            }))}
                            onChange={(e: any) => {
                                const managersIds = e.map((v: any) => v.value)
                                setProject({
                                    ...project,
                                    manager: managers.filter((manager) => managersIds.includes(manager.id))
                                })

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
                            htmlFor="name">Тег</label>
                        <MyInput
                            value={project.tag ? project.tag : ''}
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
                            value={statusList.filter(status => status.value === project.status)}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Дата старта проекта</label>
                        <MyInput
                            value={project.date_of_creation}
                            onChange={(e: any) => {
                                setProject({...project, date_of_creation: e.target.value})
                            }}
                        />
                    </div>
                    <button type="submit" onClick={onSubmit}
                            className="bg-black text-white rounded-md px-2 py-2">{project.id === 0 ? 'Добавить' : 'Сохранить'}
                    </button>

                </form>
            </div>

        </div>
    );
}
export default observer(ProjectForm);