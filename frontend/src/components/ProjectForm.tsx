import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form'
import ProjectService from "../services/ProjectService";
import {Context} from "../index";
import ManagerService from '../services/ManagerService';
import Select from "react-select";
import {Project} from "../models/ProjectResponse";
import MyInput from "./UI/MyInput";
import {format} from 'date-fns';
import {IManager} from "../models/ManagerResponse";
import {observer} from "mobx-react-lite";
import MyLabel from "./UI/MyLabel";
import Error from "./UI/Error";
import {useMutation, useQuery, useQueryClient} from "react-query";

export interface SelectProps {
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
interface MyParams {
    id: number| string;
    data: any; // Замените на тип ваших данных
}
export const FormSection =({children}: {children:React.ReactNode}) => {
    return <div className="mb-2">{children}</div>
}
const ProjectForm = ({projectId, closeSidebar, projects}: {
    projectId: number | string,
    closeSidebar: any,
    projects: Project[] |undefined
}) => {
    const {store} = useContext(Context)
    const tagsQuery = useQuery(['tags'], () => ProjectService.fetchProjectTags())
    const currentProject = useQuery(['currentProject', projectId], ({queryKey}) => {
        if (queryKey[1] !== 0){
            return ProjectService.fetchProject(queryKey[1])
        }
    }, {
        onSuccess: (data) => {
            if (data){
                setValue('name', data.name)
                setValue('manager', data.manager.map(manager => {
                    return {value: manager.id, label: `${manager.last_name} ${manager.first_name}`}
                }))
                setValue('speed_per_hour', data.speed_per_hour)
                setValue('price_for_assessor', data.price_for_assessor)
                setValue('price_for_costumer', data.price_for_costumer)
                setValue('asana_id', data.asana_id)
                setValue('unloading_value', data.unloading_value)
                setValue('unloading_regularity', data.unloading_regularity)
                setValue('status', statusList.filter(item => item.value === data.status)[0])
                setValue('tag', data.tag.map(tag => {
                    return {value: tag.id, label: tag.name}
                }))
                setValue('date_of_creation', data.date_of_creation)
            }
        }
    })
    const [managers, setManagers] = useState<SelectProps[]>([])

    const statusList = [
        {value: 'new', label: 'Новый'},
        {value: 'pilot', label: 'Пилот'},
        {value: 'active', label: 'Активный'},
        {value: 'pause', label: 'На паузе'},
        {value: 'completed', label: 'Завершен'}
    ]

    const {handleSubmit,watch, formState:{
        errors
    }, control, setValue, getValues, reset, register} = useForm<ProjectFormProps>({
        defaultValues: {
            date_of_creation: format(new Date(), 'yyyy-MM-dd'),
            manager: [{
                value: store.user_id,
                label: `${store.user_data.last_name} ${store.user_data.first_name}`
            }],
            speed_per_hour: 0,
            price_for_assessor: 0,
            price_for_costumer: 0,
            unloading_value:0,
            unloading_regularity: 0

        }
    })
    const [serverError, setServerError] = useState([])
    const queryClient = useQueryClient();
    const patchProject = useMutation((params:MyParams) => ProjectService.patchProject(params.id, params.data), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
        },
    });
    const postProject = useMutation((data:any) => ProjectService.postProject(data), {
        onSuccess: () => {
            // Инвалидация и обновление
            queryClient.invalidateQueries('projects');
        },
    });

    async function onSubmit() {
        const formValue = getValues()
        const requestData1 = {...formValue, manager: formValue.manager?.map(manager =>manager.value)}
        const requestData2 = {...requestData1, status: formValue.status.value}
        const requestData3 = {...requestData2, tag: formValue.tag?.map(tag =>tag.value)}
        if (projectId!==0){
            patchProject.mutate({id: projectId, data: requestData3})
        } else {
            postProject.mutate(requestData3)
        }
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
            <div>
                <form className="grid columns-1" onSubmit={handleSubmit(onSubmit)}>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={true}>Название проекта: </MyLabel>
                            <Error>{errors.name && errors.name?.message}</Error>
                        </div>
                        <MyInput placeholder="Название проекта" register={{...register('name', {required: 'Обязательное поле'})}}
                                 type="text"/>

                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={true}>Менеджер проекта: </MyLabel>
                            <Error>{errors.manager && errors.manager?.message}</Error>
                        </div>
                            <Select
                            options={managers}
                            value={watch('manager')}
                            isDisabled={!store.user_data.is_teamlead}
                            isMulti
                            isSearchable={false}
                            {...register('manager', {required: 'Обязательное поле'})}
                            onChange={handleSelectChange}
                        />

                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={false}>Скорость в час: </MyLabel>
                            <Error>{errors.speed_per_hour && errors.speed_per_hour?.message}</Error>
                        </div>
                        <MyInput placeholder="Скорость в час" type="text" register={{...register('speed_per_hour')}}/>
                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={false}>Цена за единицу для асессора: </MyLabel>
                        </div>
                        <MyInput placeholder="Цена за единицу для асессора" type="text" register={{...register('price_for_assessor')}}/>
                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={false}>Цена за единицу для заказчика: </MyLabel>
                        </div>
                        <MyInput placeholder="Цена за единицу для заказчика" type="text" register={{...register('price_for_costumer')}}/>
                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={false}>Объем выгрузок: </MyLabel>
                        </div>
                        <MyInput placeholder="Объем выгрузок" type="text" register={{...register('unloading_value')}}/>
                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={true}>Asana ID: </MyLabel>
                        </div>
                        <MyInput placeholder="Asana ID" type="text" register={{...register('asana_id')}}/>
                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={false}>Регулярность выгрузок: </MyLabel>
                        </div>
                        <MyInput placeholder="Регулярность выгрузок" type="text" register={{...register("unloading_regularity")}}/>
                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={true}>Статус: </MyLabel>
                        </div>
                        <Select
                            {...register('status', {required: 'Обязательное поле'})}
                            options={statusList}
                            isSearchable={false}
                            value={watch('status')}
                            onChange={handleSelectChangeStatus}
                        />
                        <Error>{errors.status && errors.status?.message}</Error>
                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel>Тег: </MyLabel>
                        </div>
                        <Select
                            options={tagsQuery.data?.results.map(tag => {
                                return{
                                    label: tag.name,
                                    value: tag.id
                            }})}
                            isMulti
                            isSearchable={false}
                            value={watch('tag')}
                            {...register('tag')}
                            onChange={handleSelectTagChange}
                        />
                    </FormSection>
                    <FormSection>
                        <div className="flex justify-between">
                        <MyLabel required={true}>Дата старта проекта</MyLabel>
                            <Error>{errors.date_of_creation && errors.date_of_creation?.message}</Error>

                        </div>
                        <MyInput placeholder="Дата старта проекта"
                                 register={{...register('date_of_creation', {required: true})}} type="text"/>
                    </FormSection>
                    <FormSection>
                        {Object.keys(serverError).map((key:any, index) => <Error key={index}>{key}: {serverError[key]}</Error>)}
                    </FormSection>
                    <button type="submit"
                            className="bg-[#5970F6] text-white rounded-md mt-2 pt-2 py-2">{projectId === 0 ? 'Добавить' : 'Сохранить'}
                    </button>

                </form>
            </div>
    );
}
export default observer(ProjectForm);