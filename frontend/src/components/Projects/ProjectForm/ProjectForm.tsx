import React, {Dispatch, useContext} from 'react';
import {useForm} from 'react-hook-form'
import {Context} from "../../../index";
import Select from "react-select";
import MyInput from "../../UI/MyInput";
import {format} from 'date-fns';
import {observer} from "mobx-react-lite";
import MyLabel from "../../UI/MyLabel";
import Error from "../../UI/Error";
import CreatableSelect from "react-select/creatable";
import MyButton from "../../UI/MyButton";
import {useRegularity, useStatus, useTags, useTeam} from "./hooks";
import {useFetchProject, usePatchProject, usePostProject} from "./queries";
import {ProjectFormProps} from "../../../models/ProjectResponse";


export const FormSection = ({children}: { children: React.ReactNode }) => {
    return <div className="mb-2">{children}</div>
}
const ProjectForm = ({projectId, closeSidebar}: {
    projectId: number | string,
    closeSidebar: Dispatch<boolean>,
}) => {
    const {store} = useContext(Context)
    const {
        handleSubmit,
        formState: {
            errors
        },
        setValue,
        getValues,
        register
    } = useForm<ProjectFormProps>({
        defaultValues: {
            date_of_creation: format(new Date(), 'yyyy-MM-dd'),
            manager: !store.user_data.is_teamlead ? [store.user_id] : [],
            speed_per_hour: 0,
            price_for_assessor: 0,
            price_for_costumer: 0,
            unloading_value: 0,
            unloading_regularity: ''

        }
    })

    const {tagsQuery, onTagChange, getValueTag, setCurrentTags} = useTags({setValue})
    const {fetchTeam, onManagerChange, getManager, setSelectedManagers} = useTeam({setValue})
    const {regOptions, onChangeRegularity, getRegularity, setRegularity, setRegOptions} = useRegularity({setValue})
    const {statusList, getValueStatus, onChangeStatus, setCurrentStatus} = useStatus({setValue})
    const {isFetching} = useFetchProject({
        projectId,
        setValue,
        setSelectedManagers,
        setCurrentTags,
        setRegularity,
        setCurrentStatus,
        regOptions,
        setRegOptions
    })
    const patchProject = usePatchProject({closeSidebar})
    const postProject = usePostProject({closeSidebar})

    function onSubmit() {
        const formValue = getValues()
        if (projectId !== 0) {
            patchProject.mutate({id: projectId, data: formValue})
        } else {
            postProject.mutate(formValue)
        }
    }

    return (
        <div className="w-[30rem]">
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex h-2 justify-end w-full pb-[5px]">
                    <div className="cursor-pointer text-[18px]" onClick={() => closeSidebar(false)}>x</div>
                </div>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Название проекта: </MyLabel>
                        <Error>{errors.name && errors.name?.message}</Error>
                    </div>
                    <MyInput placeholder={isFetching ? "Загрузка" : "Название проекта"}
                             className={'pl-[12px]'}
                             register={{...register('name', {required: 'Обязательное поле'})}}
                             type="text"/>
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Asana ID: </MyLabel>
                        <Error>{errors.status && errors.status?.message}</Error>
                    </div>
                    <MyInput className={'pl-[12px]'}
                             placeholder={isFetching ? "Загрузка" : "Asana ID"}
                             type="text"
                             register={{...register('asana_id', {required: 'Обязательное поле'})}}/>
                </FormSection>
                {store.user_data.is_teamlead && <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Менеджер проекта: </MyLabel>
                        <Error>{errors.manager && errors.manager?.message}</Error>
                    </div>

                    <Select
                        options={fetchTeam.isSuccess ? fetchTeam.data : []}
                        value={getManager()}
                        isDisabled={!store.user_data.is_teamlead}
                        isMulti
                        placeholder={isFetching ? "Загрузка" : "Менеджер"}
                        isSearchable={false}
                        {...register('manager', {required: 'Обязательное поле'})}
                        onChange={onManagerChange}
                    />

                </FormSection>}
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Скорость в час: </MyLabel>
                        <Error>{errors.speed_per_hour && errors.speed_per_hour?.message}</Error>
                    </div>
                    <MyInput className={'pl-[12px]'}
                             placeholder={isFetching ? "Загрузка" : "Скорость в час"}
                             type="text"
                             register={{
                                 ...register('speed_per_hour', {
                                     pattern: {
                                         value: /^([0-9]*)$/,
                                         message: 'Указано неверное значение'
                                     }
                                 })
                             }}/>
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Цена за единицу для асессора: </MyLabel>
                        <Error>{errors.price_for_assessor && errors.price_for_assessor?.message}</Error>
                    </div>
                    <MyInput className={'pl-[12px]'}
                             placeholder={isFetching ? "Загрузка" : "Цена за единицу для асессора"} type="text"
                             register={{
                                 ...register('price_for_assessor', {
                                     pattern: {
                                         value: /^([0-9]*)[.]?([0-9]+)$/,
                                         message: 'Указано неверное значение'
                                     }
                                 })
                             }}/>
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Цена за единицу для заказчика: </MyLabel>
                        <Error>{errors.price_for_costumer && errors.price_for_costumer?.message}</Error>
                    </div>
                    <MyInput className={'pl-[12px]'}
                             placeholder={isFetching ? "Загрузка" : "Цена за единицу для заказчика"} type="text"
                             register={{
                                 ...register('price_for_costumer', {
                                     pattern: {
                                         value: /^([0-9]*)[.]?([0-9]+)$/,
                                         message: 'Указано неверное значение'
                                     },
                                 })
                             }}/>
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Объем выгрузок: </MyLabel>
                    </div>
                    <MyInput className={'pl-[12px]'}
                             placeholder={isFetching ? "Загрузка" : "Объем выгрузок"}
                             type="text"
                             register={{
                                 ...register('unloading_value', {
                                     pattern: {
                                         value: /^([0-9]*)[.]?([0-9]+)$/,
                                         message: 'Указано неверное значение'
                                     }
                                 })
                             }}/>
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Регулярность выгрузок: </MyLabel>
                    </div>
                    <CreatableSelect
                        {...register("unloading_regularity")}
                        placeholder={isFetching ? "Загрузка" : 'Регуляность выгрузок'}
                        options={regOptions}
                        onChange={onChangeRegularity}
                        value={getRegularity()}
                        className='text-start'
                    />
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Статус: </MyLabel>
                        <Error>{errors.status && errors.status?.message}</Error>
                    </div>
                    <Select
                        {...register('status', {
                            required: 'Обязательное поле'
                        })}
                        placeholder={isFetching ? "Загрузка" : 'Статус'}
                        options={statusList}
                        value={getValueStatus()}
                        onChange={onChangeStatus}
                        className='text-start'
                    />
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel>Тег: </MyLabel>
                    </div>
                    <Select
                        options={tagsQuery.isSuccess ? tagsQuery.data : []}
                        isMulti
                        placeholder={isFetching ? "Загрузка" : 'Тег'}
                        value={getValueTag()}
                        isSearchable={false}
                        {...register('tag')}
                        onChange={onTagChange}
                        className='text-start'
                    />
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Дата старта проекта</MyLabel>
                        <Error>{errors.date_of_creation && errors.date_of_creation?.message}</Error>
                    </div>
                    <MyInput className={'pl-[12px]'}
                             placeholder={isFetching ? "Загрузка" : "Дата старта проекта"}
                             register={{...register('date_of_creation', {required: true})}}
                             type="date"/>
                </FormSection>
                <MyButton className='w-full'>{projectId === 0 ? 'Добавить' : 'Сохранить'}</MyButton>
            </form>
        </div>
    );
}
export default observer(ProjectForm);