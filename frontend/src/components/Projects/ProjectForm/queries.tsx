import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../../services/ProjectService";
import {errorNotification, successNotification} from "../../UI/Notify";
import {AxiosError} from "axios";
import React, {Dispatch} from "react";
import {ProjectFormProps} from "../../../models/ProjectResponse";

interface MyParams {
    id: number | string;
    data: ProjectFormProps;
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
export const usePatchProject = ({closeSidebar} : {
    closeSidebar: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient();
    return useMutation((data: MyParams) => ProjectService.patchProject(data.id, data.data), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects');
            queryClient.invalidateQueries('completedProjects')
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
    })
}

export const usePostProject = ({closeSidebar} : {
    closeSidebar: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient();
    return useMutation((data: ProjectFormProps) => ProjectService.postProject(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects')
            queryClient.invalidateQueries('completedProjects')
            successNotification('Проект успешно создан')
            closeSidebar(false)
        },
        onError: (error: AxiosError, error_list: any) => {
            const errors = error.response?.data ? error.response?.data : {}
            const keys = Object.keys(errors)
            // @ts-ignore
            const notify = <div>{keys.map(key => <p key={key}>{`${error_list[key]}: ${errors[key][0]}`}</p>)}</div>
            errorNotification(notify)
        }
    });
}
export const getError = (error: any) => {
    const errors = error.response?.data ? error.response?.data : {}
    const keys = Object.keys(errors)
    // @ts-ignore
    const notify = <div>{keys.map(key => <p key={key}>{`${error_list[key]}: ${errors[key][0]}`}</p>)}</div>
    errorNotification(notify)
}
export const useFetchProject = ({projectId, setValue, setSelectedManagers, setCurrentTags, setRegularity, setCurrentStatus, regOptions, setRegOptions}: {
    projectId: number | string,
    setValue: any,
    setSelectedManagers: Dispatch<number[]>,
    setCurrentTags: Dispatch<number[]>,
    setRegularity: Dispatch<string>,
    setCurrentStatus: Dispatch<string>
    regOptions: {label: string, value:string}[],
    setRegOptions: Dispatch<{label: string, value:string}[]>
}) => {
    return useQuery(['currentProject', projectId], ({queryKey}) => ProjectService.fetchProject(queryKey[1]), {
        enabled: projectId !== 0,
        refetchOnWindowFocus:false,
        onSuccess: (data) => {
            setValue('name', data.name)
            setValue('manager', data.manager.map(manager => manager.id))
            setSelectedManagers([...data.manager.map(manager => manager.id)])
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
    })
}