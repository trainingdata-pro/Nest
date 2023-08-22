import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form'
import ProjectService, {Tag} from "../services/ProjectService";
import {Context} from "../index";
import ManagerService from '../services/ManagerService';
import Select from "react-select";
import {Project} from "../models/ProjectResponse";
import MyInput from "./UI/MyInput";
import {format} from 'date-fns';
import {IManager} from "../models/ManagerResponse";
import {observer} from "mobx-react-lite";
import MyLabel from "./UI/MyLabel";

interface SelectProps {
    value: string | number,
    label: string
}

interface ProjectFormProps {
    name: string,
    asana_id: number | string,
    manager: SelectProps[] | null,
    speed_per_hour: number | string,
    project: SelectProps[] | null,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: number,
    status: SelectProps,
    tag: SelectProps[] | null,
    date_of_creation: string
}
const FormSection =({children}: {children:React.ReactNode}) => {
    return <div className="mb-2">{children}</div>
}
const ProjectForm = ({projectId, setNewData, closeSidebar}: {
    projectId: number | string,
    setNewData: Dispatch<SetStateAction<Project[]>>,
    closeSidebar: Dispatch<SetStateAction<boolean>>
}) => {
    const {store} = useContext(Context)
    useEffect(() => {
        if (projectId) {
            if (projectId !== 0) {
                ProjectService.fetchProject(projectId).then(res => {
                    setValue('name', res.data.name)
                    setValue('speed_per_hour', res.data.speed_per_hour)
                    setValue('price_for_assessor', res.data.price_for_assessor)
                })
            } else {
                // setValue('date_of_creation', format(new Date(), 'yyyy-MM-dd'))
                // setProject({
                //     tag: [],
                //     id: 0,
                //     name: '',
                //     manager: [],
                //     assessors_count: 0,
                //     backlog: '',
                //     asana_id: 0,
                //     speed_per_hour: 0,
                //     price_for_assessor: 0,
                //     price_for_costumer: 0,
                //     unloading_value: 0,
                //     unloading_regularity: 0,
                //     status: '',
                //     date_of_creation: format(new Date(), 'yyyy-MM-dd')
                // })
            }
        }
    }, [projectId])


    useEffect(() => {
        ManagerService.fetch_managers().then((res: any) => {
            setManagers(res.data.results.map((manager: IManager) => {
                return {
                    value: manager.id, label: `${manager.last_name} ${manager.first_name}`
                }
            }))
        })
        ProjectService.fetchProjectTags().then((res) => {
            setTags(res.data.results.map((tag) => {
                console.log(tag)
                return {value: tag.id, label: tag.name}
            }))
        })

        console.log(managers)
    }, [])
    const [tags, setTags] = useState<SelectProps[]>()
    const [project, setProject] = useState<Project>()
    const [managers, setManagers] = useState<SelectProps[]>([])
    const statusList = [
        {value: 'active', label: 'Активный'},
        {value: 'pause', label: 'На паузе'},
        {value: 'completed', label: 'Завершен'}
    ]

    const {handleSubmit, control, setValue, getValues, reset, register} = useForm<ProjectFormProps>({
        defaultValues: {
            date_of_creation: format(new Date(), 'yyyy-MM-dd'),
            manager: [{
                value: store.managerData.id,
                label: `${store.managerData.last_name} ${store.managerData.first_name}`
            }],
            speed_per_hour: project?.speed_per_hour ? project.speed_per_hour : 0
        }
    })
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

    const handleSelectChange = (value: any) => {
        if (value) {
            setValue('manager', value);
        } else {
            setValue('manager', null);
        }
    };
    const handleSelectTagChange = (value: any) => {
        if (value) {
            setValue('tag', value);
        } else {
            setValue('tag', null);
        }
    };
    const handleSelectChangeStatus = (value: any) => {
            setValue('status', value);

    };
    return (
            <div className={"w-[90%]"}>
                <form className="grid columns-1" onSubmit={handleSubmit(onSubmit)}>
                    <FormSection>
                        <MyLabel required={true}>Название проекта</MyLabel>
                        <MyInput placeholder="Название проекта" register={{...register('name', {required: true})}}
                                 type="text"/>
                    </FormSection>
                    <FormSection>
                        <MyLabel required={true}>Менеджер проекта</MyLabel>
                        <Select
                            options={managers}
                            isMulti
                            defaultValue={getValues('manager')}
                            {...register('manager')}
                            onChange={handleSelectChange}
                        />
                    </FormSection>
                    <FormSection>
                        <MyLabel required={false}>Скорость в час</MyLabel>
                        <MyInput placeholder="Скорость в час" type="text" register={{...register('speed_per_hour')}}/>
                    </FormSection>
                    <FormSection>
                        <MyLabel required={false}>Цена за единицу для асессора</MyLabel>
                        <MyInput placeholder="Цена за единицу для асессора" type="text" register={{...register('price_for_assessor')}}/>
                    </FormSection>
                    <FormSection>
                        <MyLabel required={false}>Цена за единицу для заказчика</MyLabel>
                        <MyInput placeholder="Цена за единицу для заказчика" type="text" register={{...register('price_for_costumer')}}/>
                    </FormSection>
                    <FormSection>
                        <MyLabel required={false}>Объем выгрузок</MyLabel>
                        <MyInput placeholder="Объем выгрузок" type="text" register={{...register('unloading_value')}}/>
                    </FormSection>
                    <FormSection>
                        <MyLabel required={false}>Регулярность выгрузок</MyLabel>
                        <MyInput placeholder="Регулярность выгрузок" type="text" register={{...register("unloading_regularity")}}/>
                    </FormSection>
                    <FormSection>
                        <MyLabel required={true}>Статус</MyLabel>
                        <Select
                            options={statusList}
                            defaultValue={getValues('status')}
                            {...register('status')}
                            onChange={handleSelectChangeStatus}
                        />
                    </FormSection>
                    <FormSection>
                        <MyLabel required={true}>Тег</MyLabel>
                        <Select
                            options={tags}
                            isMulti
                            defaultValue={getValues('tag')}
                            {...register('tag')}
                            onChange={handleSelectTagChange}
                        />
                    </FormSection>
                    <FormSection>
                        <MyLabel required={true}>Дата старта проекта</MyLabel>
                        <MyInput placeholder="Дата старта проекта"
                                 register={{...register('date_of_creation', {required: true})}} type="text"/>
                    </FormSection>
                    <button type="submit"
                            className="bg-black text-white rounded-md px-2 py-2">{project?.id === 0 ? 'Добавить' : 'Сохранить'}
                    </button>

                </form>
            </div>
    );
}
export default observer(ProjectForm);