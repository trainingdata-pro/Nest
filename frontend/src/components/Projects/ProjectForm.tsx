import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form'
import ProjectService from "../../services/ProjectService";
import {Context} from "../../index";
import ManagerService from '../../services/ManagerService';
import Select from "react-select";
import {Project} from "../../models/ProjectResponse";
import MyInput from "../UI/MyInput";
import {format} from 'date-fns';
import {IManager} from "../../models/ManagerResponse";
import {observer} from "mobx-react-lite";
import MyLabel from "../UI/MyLabel";
import Error from "../UI/Error";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {AxiosError} from "axios";

export interface SelectProps {
    value: string | number,
    label: string
}

type ProjectFormProps = {
    name: string,
    asana_id: number | string,
    manager: number[]
    speed_per_hour: number | string,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: number,
    status: string | undefined,
    tag: number[] | string[],
    date_of_creation: string
}

interface MyParams {
    id: number | string;
    data: any;
}

export const FormSection = ({children}: { children: React.ReactNode }) => {
    return <div className="mb-2">{children}</div>
}
const ProjectForm = ({projectId, closeSidebar}: {
    projectId: number | string,
    closeSidebar: any,
}) => {
    const {store} = useContext(Context)
    const tagsQuery = useQuery(['tags'], () => ProjectService.fetchProjectTags(), {
        onSuccess: data => {
            setTagsList(data.results.map(tag => {
                return {label: tag.name, value: tag.id}
            }))
        }
    })
    const currentProject = useQuery(['currentProject', projectId], ({queryKey}) => {
        if (queryKey[1] !== 0) {
            return ProjectService.fetchProject(queryKey[1])
        }
    }, {
        onSuccess: (data) => {
            if (data) {
                setValue('name', data.name)
                setValue('manager', data.manager.length !==0 ? data.manager.map(manager => manager.id): (store.user_data.is_teamlead ? [] : [store.user_id]))
                setValue('speed_per_hour', data.speed_per_hour)
                setValue('price_for_assessor', data.price_for_assessor)
                setValue('price_for_costumer', data.price_for_costumer)
                setValue('asana_id', data.asana_id)
                setValue('unloading_value', data.unloading_value)
                setValue('unloading_regularity', data.unloading_regularity)
                setValue('status', data.status)
                setValue('tag', data.tag.map(tag => tag.id))
                setValue('date_of_creation', data.date_of_creation)
                setValue('status', data.status)
                console.log(data.tag)
                setCurrentTags(data.tag.map(tag => {
                    return tag.id
                }))
                setCurrentStatus(data.status)
            }
        }
    })

    const statusList = [
        {value: 'active', label: 'Активный'},
        {value: 'pause', label: 'На паузе'},
        {value: 'completed', label: 'Завершен'}
    ]

    const {
        handleSubmit,
        watch,
        formState: {
            errors
        },
        setValue,
        getValues,
        register
    } = useForm<ProjectFormProps>({
        defaultValues: {
            date_of_creation: format(new Date(), 'yyyy-MM-dd'),
            manager: [store.user_id],
            speed_per_hour: 0,
            price_for_assessor: 0,
            price_for_costumer: 0,
            unloading_value: 0,
            unloading_regularity: 0

        }
    })
    const queryClient = useQueryClient();
    const patchProject = useMutation((params: MyParams) => ProjectService.patchProject(params.id, params.data), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
        },
    });
    const postProject = useMutation((data: any) => ProjectService.postProject(data), {
        onSuccess: () => queryClient.invalidateQueries('projects'),
        onError: (error:AxiosError) => console.log(error.request.response)
    });
    const [tagsList, setTagsList] = useState<any[]>([])
    const [currentTags, setCurrentTags] = useState<number[]>([])

    const [currentStatus, setCurrentStatus] = useState<string>()
    function onSubmit() {
        const formValue = getValues()
        if (projectId !== 0) {
            patchProject.mutate({id: projectId, data: formValue})
            closeSidebar(false)
        } else {
            postProject.mutate(formValue)
            closeSidebar(false)
        }
    }

    const onTagChange = (newValue:any) => {
        const tagsId = newValue.map((value:any) => value.value)
        setCurrentTags(tagsId)
        setValue('tag', tagsId)
    }
    const getValueTag = () => {
        if (currentTags){
            return tagsList.filter((tag:any) => currentTags.indexOf(tag.value) >= 0)
        } else {
            return []
        }
    }
    const onChangeStatus = (newValue:any) => {
        setCurrentStatus(newValue.value)
        setValue('status', newValue.value)

    }
    const getValueStatus = ()=> {
        return currentStatus ? statusList.find(s => s.value === currentStatus) : ''
    }
    return (
        <div className="w-[30rem]">
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Название проекта: </MyLabel>
                        <Error>{errors.name && errors.name?.message}</Error>
                    </div>

                    <MyInput placeholder="Название проекта"
                             register={{...register('name', {required: 'Обязательное поле'})}}
                             type="text"/>
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Asana ID: </MyLabel>
                        <Error>{errors.status && errors.status?.message}</Error>
                    </div>
                    <MyInput placeholder="Asana ID" type="text" register={{...register('asana_id', {required:'Обязательное поле'})}}/>
                </FormSection>
                {store.user_data.is_teamlead && <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Менеджер проекта: </MyLabel>
                        <Error>{errors.manager && errors.manager?.message}</Error>
                    </div>

                    <Select
                        options={[]}
                        value={watch('manager')}
                        isDisabled={!store.user_data.is_teamlead}
                        isMulti
                        isSearchable={false}
                        {...register('manager', {required: 'Обязательное поле'})}
                        onChange={(newValue) => console.log(newValue)}
                    />

                </FormSection>}
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Скорость в час: </MyLabel>
                        <Error>{errors.speed_per_hour && errors.speed_per_hour?.message}</Error>
                    </div>
                    <MyInput placeholder="Скорость в час" type="text" register={{...register('speed_per_hour', {
                        pattern:{
                            value: /^-?\d+(\.\d+)?$/,
                            message: 'Указано неверное значение'
                        }
                        })}}/>
                </FormSection>

                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Цена за единицу для асессора: </MyLabel>
                        <Error>{errors.speed_per_hour && errors.speed_per_hour?.message}</Error>
                    </div>
                    <MyInput placeholder="Цена за единицу для асессора" type="text"
                             register={{...register('price_for_assessor')}}/>
                </FormSection>

                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Цена за единицу для заказчика: </MyLabel>
                        <Error>{errors.speed_per_hour && errors.speed_per_hour?.message}</Error>

                    </div>
                    <MyInput placeholder="Цена за единицу для заказчика" type="text"
                             register={{...register('price_for_costumer',{
                                 pattern:{
                                 value: /^-?\d+(\.\d+)?$/,
                                 message: 'Указано неверное значение'
                             }
                             })}}/>
                </FormSection>

                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Объем выгрузок: </MyLabel>
                    </div>
                    <MyInput placeholder="Объем выгрузок" type="text" register={{...register('unloading_value',{
                        pattern:{
                        value: /^-?\d+(\.\d+)?$/,
                        message: 'Указано неверное значение'
                    }
                    })}}/>
                </FormSection>



                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Регулярность выгрузок: </MyLabel>
                    </div>
                    <MyInput placeholder="Регулярность выгрузок" type="text"
                             register={{...register("unloading_regularity")}}/>
                </FormSection>

                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Статус: </MyLabel>
                        <Error>{errors.status && errors.status?.message}</Error>
                    </div>
                    <div className=''>
                    <Select
                        {...register('status',{
                            required: 'Обязательное поле'
                        })}
                        options={statusList}
                        isSearchable={false}
                        value={getValueStatus()}
                        onChange={onChangeStatus}
                    />
                    </div>
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel>Тег: </MyLabel>
                    </div>
                    <Select
                        options={tagsList}
                        isMulti
                        value={getValueTag()}
                        isSearchable={false}
                        {...register('tag')}
                        onChange={onTagChange}
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

                <button type="submit"
                        className="bg-[#5970F6] w-full text-white rounded-md mt-2 pt-2 py-2">{projectId === 0 ? 'Добавить' : 'Сохранить'}
                </button>

            </form>
        </div>
    );
}
export default observer(ProjectForm);