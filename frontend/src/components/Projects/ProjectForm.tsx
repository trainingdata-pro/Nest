import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form'
import ProjectService from "../../services/ProjectService";
import {Context} from "../../index";
import Select from "react-select";
import MyInput from "../UI/MyInput";
import {format} from 'date-fns';
import {observer} from "mobx-react-lite";
import MyLabel from "../UI/MyLabel";
import Error from "../UI/Error";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {errorNotification, successNotification} from "../UI/Notify";
import CreatableSelect from "react-select/creatable";
import MyButton from "../UI/MyButton";
import ManagerService from "../../services/ManagerService";

type ProjectFormProps = {
    name: string,
    asana_id: number | string,
    manager: number[]
    speed_per_hour: number | string,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: string,
    status: string | undefined,
    tag: number[] | string[],
    date_of_creation: string
}
const Errors = {
    name: 'Название',
    asana_id: 'Асана ID',
    manager: 'Менеджер',
    speed_per_hour: 'Скорость в час',
    price_for_assessor: 'Цена за единицу для асессора',
    price_for_costumer: 'Цена за единицу для заказчика',
    unloading_value: 'Объем выгрузок',
    unloading_regularity: 'Регулярность выгрузок',
    status: 'Статус',
    tag: 'Тег',
    date_of_creation: 'Дата старта проекта'

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
    const managers = useQuery('managers', () => ManagerService.fetchTeamLeadTeam(store.user_id),{
        enabled: store.user_data.is_teamlead,
        retry: 0,
        onSuccess: data => {
            console.log(data)
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
                setValue('manager', data.manager.length !== 0 ? data.manager.map(manager => manager.id) : (store.user_data.is_teamlead ? [] : [store.user_id]))
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
                setCurrentTags(data.tag.map(tag => {
                    return tag.id
                }))
                setRegularity(data.unloading_regularity)
                setCurrentStatus(data.status)
                if (regOptions.find(req => req.value === data.unloading_regularity) === undefined){
                    setRegOptions([...regOptions, {label: data.unloading_regularity, value: data.unloading_regularity}])
                }

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
            unloading_regularity: ''

        }
    })
    const queryClient = useQueryClient();
    const patchProject = useMutation((params: MyParams) => ProjectService.patchProject(params.id, params.data), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
            successNotification('Проект успешно обновлен')
            closeSidebar(false)
        },
        onError: (error: AxiosError) => {
            const errors = error.response?.data ? error.response?.data : {}
            const keys = Object.keys(errors)
            // @ts-ignore
            const notify = <div>{keys.map(key => <p key={key}>{`${Errors[key]}: ${errors[key][0]}`}</p>)}</div>
            errorNotification(notify)
        }
    });
    const postProject = useMutation((data: any) => ProjectService.postProject(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects')
            successNotification('Проект успешно создан')
            closeSidebar(false)
        },
        onError: (error: AxiosError) => {
            const errors = error.response?.data ? error.response?.data : {}
            const keys = Object.keys(errors)
            // @ts-ignore
            const notify = <div>{keys.map(key => <p key={key}>{`${Errors[key]}: ${errors[key][0]}`}</p>)}</div>
            errorNotification(notify)
        }
    });
    const [currentTags, setCurrentTags] = useState<number[]>([])
    const [tagsList, setTagsList] = useState<any[]>([])
    const onTagChange = (newValue: any) => {
        const tagsId = newValue.map((value: any) => value.value)
        setCurrentTags(tagsId)
        setValue('tag', tagsId)
    }
    const getValueTag = () => {
        if (currentTags) {
            return tagsList.filter((tag: any) => currentTags.indexOf(tag.value) >= 0)
        } else {
            return []
        }
    }

    const [currentStatus, setCurrentStatus] = useState<string>()
    const getValueStatus = () => {
        return currentStatus ? statusList.find(s => s.value === currentStatus) : ''
    }
    const [regularity, setRegularity] = useState('')
    const onChangeStatus = (newValue: any) => {
        setCurrentStatus(newValue.value)
        setValue('status', newValue.value)
    }

    const onChangeRegularity = (newValue: any) => {
        setRegularity(newValue.value)
        setValue('unloading_regularity', newValue.value)
    }
    const getRegularity = () => {
        return regularity ? regOptions.find(s => s.value === regularity): ''
    }
    const [regOptions, setRegOptions] = useState([{label: 'Разовая', value: 'Разовая'},
        {label: 'Будние дни', value: 'Будние дни'},
        {label: 'Ежедневно', value: 'Ежедневно'},
        {label: 'Раз в неделю', value: 'Раз в неделю'},
        {label: 'Раз в две недели', value: 'Раз в две недели'},
        {label: 'Раз в месяц', value: 'Раз в месяц'}
    ])

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

                    <MyInput placeholder="Название проекта" className={'pl-[12px]'}
                             register={{...register('name', {required: 'Обязательное поле'})}}
                             type="text"/>
                </FormSection>
                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={true}>Asana ID: </MyLabel>
                        <Error>{errors.status && errors.status?.message}</Error>
                    </div>
                    <MyInput className={'pl-[12px]'} placeholder="Asana ID" type="text"
                             register={{...register('asana_id', {required: 'Обязательное поле'})}}/>
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
                    <MyInput className={'pl-[12px]'} placeholder="Скорость в час" type="text" register={{
                        ...register('speed_per_hour', {
                            pattern: {
                                value: /^([0-9]{0,})$/,
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
                    <MyInput className={'pl-[12px]'} placeholder="Цена за единицу для асессора" type="text"
                             register={{...register('price_for_assessor', {
                                     pattern: {
                                         value: /^([0-9]{0,})[.]?([0-9]{1,})$/,
                                         message: 'Указано неверное значение'
                                     }
                                 })}}/>
                </FormSection>

                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Цена за единицу для заказчика: </MyLabel>
                        <Error>{errors.price_for_costumer && errors.price_for_costumer?.message}</Error>
                    </div>
                    <MyInput className={'pl-[12px]'} placeholder="Цена за единицу для заказчика" type="text"
                             register={{
                                 ...register('price_for_costumer', {
                                     pattern: {
                                         value: /^([0-9]{0,})[.]?([0-9]{1,})$/,
                                         message: 'Указано неверное значение'
                                     },
                                 })
                             }}/>
                </FormSection>

                <FormSection>
                    <div className="flex justify-between">
                        <MyLabel required={false}>Объем выгрузок: </MyLabel>
                    </div>
                    <MyInput className={'pl-[12px]'} placeholder="Объем выгрузок" type="text" register={{
                        ...register('unloading_value', {
                            pattern: {
                                value: /^([0-9]{0,})[.]?([0-9]{1,})$/,
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
                    <MyInput className={'pl-[12px]'} placeholder="Дата старта проекта"
                             register={{...register('date_of_creation', {required: true})}} type="date"/>
                </FormSection>

                <MyButton className='w-full'>{projectId === 0 ? 'Добавить' : 'Сохранить'}</MyButton>

            </form>
        </div>
    );
}
export default observer(ProjectForm);