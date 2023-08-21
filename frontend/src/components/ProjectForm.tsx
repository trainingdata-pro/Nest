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
import MyLabel from "./UI/MyLabel";

interface ProjectFormProps {
    name: string,
    manager: any,
    speed_per_hour: number,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: number,
    status: string,
    tag: number[],
    date_of_creation: string
}
// @ts-ignore
const ProjectForm = ({projectId, setNewData, closeSidebar}) => {
    const {handleSubmit,getValues, reset, register} = useForm<ProjectFormProps>()
    const {store} = useContext(Context)
    useEffect(() => {
        ManagerService.fetch_managers().then((res: any) => {
            setManagers(res.data.results.map((manager:IManager) => {
                return {
                    value:manager.id, label: `${manager.last_name} ${manager.first_name}`
                }}))
        })
        if (projectId){
            if(projectId!==0){
                ProjectService.fetchProject(projectId).then(res => {
                    // @ts-ignore
                    setProject({...res.data, tag: res.data.tag.map(tag => tag.id)})
                })
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
                    // tag: [1],
                    date_of_creation: format(new Date(), 'yyyy-MM-dd')
                })
            }}
        console.log(managers)
    }, [projectId])
    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
    ];
    const [project, setProject] = useState<Project>()
    const [managers, setManagers] = useState<any[]>([])
    const statusList = [
        {value: 'active', label: 'Активный'},
        {value: 'pause', label: 'На паузе'},
        {value: 'completed', label: 'Завершен'}
    ]


    async function onSubmit() {
        console.log(getValues())
        // const projectData: any = {...project, manager: project?.manager.map(manager => manager.id)}
        // if (project?.id === 0) {
        //     await ProjectService.addProject(projectData).then(() => {
        //         closeSidebar(false)
        //     })
        //     await ProjectService.fetchProjects(store.managerData.id.toString()).then(res => {
        //         setNewData(res.data.results.filter(project => project.status !== 'completed'))
        //     })
        // } else {
        //     await ProjectService.patchProject(project?.id, projectData).then(() => {
        //         closeSidebar(false)
        //     })
        //     await ProjectService.fetchProjects(store.managerData.id.toString()).then(res => {
        //         setNewData(res.data.results.filter(project => project.status !== 'completed'))
        //     })
        // }
    }
    const [selectedManagers, setSelectedManagers] = useState()
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className={"w-[90%]"} >
                <form className="grid columns-1" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-2">
                        <MyLabel required={true} >Название проекта</MyLabel>
                        <MyInput placeholder="Название проекта" register={{...register('name', {required:true})}} type="password"/>
                    </div>
                    <Select
                        {...register('manager')}
                        options={managers}
                        placeholder="Select an option"
                        isMulti
                        onChange={(selectedOptions) => {
                            console.log(selectedOptions)
                        }}
                    />
                    {/*<div className="mb-2">*/}
                    {/*    <label*/}
                    {/*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                    {/*        htmlFor="asana_id">Asana ID <span className="text-red-700">*</span></label>*/}
                    {/*    <MyInput*/}
                    {/*        value={project.asana_id}*/}
                    {/*        onChange={(e: any) => setProject({...project, asana_id: e.target.value})}*/}
                    {/*        required={true}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="mb-2">*/}
                    {/*    <label>Менеджер проекта <span className="text-red-700">*</span></label>*/}

                    {/*    <Select*/}
                    {/*        options={managers.map(manager => ({*/}
                    {/*            "value": manager.id,*/}
                    {/*            "label": `${manager.last_name} ${manager.first_name}`*/}
                    {/*        }))}*/}
                    {/*        value={project.manager.map((manager) => ({*/}
                    {/*            "value": manager.id,*/}
                    {/*            "label": `${manager.last_name} ${manager.first_name}`*/}
                    {/*        }))}*/}
                    {/*        onChange={(e: any) => {*/}
                    {/*            const managersIds = e.map((v: any) => v.value)*/}
                    {/*            setProject({*/}
                    {/*                ...project,*/}
                    {/*                manager: managers.filter((manager) => managersIds.includes(manager.id))*/}
                    {/*            })*/}

                    {/*        }}*/}
                    {/*        isMulti*/}

                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="mb-2">*/}
                    {/*    <label*/}
                    {/*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                    {/*        htmlFor="name">Скорость в час</label>*/}
                    {/*    <MyInput*/}
                    {/*        value={project.speed_per_hour ? project.speed_per_hour : 0}*/}
                    {/*        onChange={(e: any) => setProject({...project, speed_per_hour: e.target.value})}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="mb-2">*/}
                    {/*    <label*/}
                    {/*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                    {/*        htmlFor="name">Цена за единицу для ассесора</label>*/}
                    {/*    <MyInput*/}
                    {/*        value={project.price_for_assessor ? project.price_for_assessor : 0}*/}
                    {/*        onChange={(e: any) => setProject({...project, price_for_assessor: e.target.value})}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*/!*<div className="mb-2">*!/*/}
                    {/*/!*    <label*!/*/}
                    {/*/!*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*!/*/}
                    {/*/!*        htmlFor="name">Тег</label>*!/*/}
                    {/*/!*    <MyInput*!/*/}
                    {/*/!*        // value={project.tag ? project.tag : 0}*!/*/}
                    {/*/!*        value={[1]}*!/*/}
                    {/*/!*        onChange={(e: any) => setProject({...project, tag: [e.target.value]})}*!/*/}
                    {/*/!*    />*!/*/}
                    {/*/!*</div>*!/*/}
                    {/*<div className="mb-2">*/}
                    {/*    <label*/}
                    {/*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                    {/*        htmlFor="name">Цена за единицу для заказчика</label>*/}
                    {/*    <MyInput*/}
                    {/*        value={project.price_for_costumer ? project.price_for_costumer : 0}*/}
                    {/*        onChange={(e: any) => setProject({...project, price_for_costumer: e.target.value})}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="mb-2">*/}
                    {/*    <label*/}
                    {/*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                    {/*        htmlFor="name">Объем выгрузок</label>*/}
                    {/*    <MyInput*/}
                    {/*        value={project.unloading_value ? project.unloading_value : 0}*/}
                    {/*        onChange={(e: any) => setProject({...project, unloading_value: e.target.value})}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="mb-2">*/}
                    {/*    <label*/}
                    {/*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                    {/*        htmlFor="name">Регулярность выгрузок</label>*/}
                    {/*    <MyInput*/}
                    {/*        value={project.unloading_regularity ? project.unloading_regularity : 0}*/}
                    {/*        onChange={(e: any) => setProject({...project, unloading_regularity: e.target.value})}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="mb-2">*/}
                    {/*    <label*/}
                    {/*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                    {/*        htmlFor="name">Статус проекта <span className="text-red-700">*</span></label>*/}
                    {/*    <Select*/}
                    {/*        options={statusList}*/}

                    {/*        onChange={(e) => {*/}
                    {/*            // @ts-ignore*/}
                    {/*            setProject({...project, status: e.value})*/}
                    {/*        }}*/}
                    {/*        value={statusList.filter(status => status.value === project.status)}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="mb-2">*/}
                    {/*    <label*/}
                    {/*        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"*/}
                    {/*        htmlFor="name">Дата старта проекта</label>*/}
                    {/*    <MyInput*/}
                    {/*        value={project.date_of_creation}*/}
                    {/*        onChange={(e: any) => {*/}
                    {/*            setProject({...project, date_of_creation: e.target.value})*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    <button type="submit"
                            className="bg-black text-white rounded-md px-2 py-2">{project?.id === 0 ? 'Добавить' : 'Сохранить'}
                    </button>

                </form>
            </div>

        </div>
    );
}
export default observer(ProjectForm);