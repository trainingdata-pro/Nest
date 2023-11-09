import React, {useContext, useEffect, useState} from 'react';
import {CheckIcon, PencilSquareIcon} from "@heroicons/react/24/outline";
import {IAssessorProjects, PatchWorkingHours, WorkingHours} from "../../../models/AssessorResponse";
import {useForm} from "react-hook-form";
import Select, {SingleValue} from "react-select";
import AssessorService from "../../../services/AssessorService";
import {Context} from "../../../index";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Project} from "../../../models/ProjectResponse";
import {errorNotification, successNotification} from "../../UI/Notify";


type ProjectsProps = {
    workloadStatus: string,
    workingHours: WorkingHours
}
const status = [
    {value: 'full', label:'Полная загрузка'},
    {value: 'partial', label: 'Частичная загрузка'},
    {value: 'reserved', label: 'Зарезервирован'}
]
const AssessorProjectRow = ({project, assessorId}: {
    project: IAssessorProjects,
    assessorId: string | number | undefined
}) => {
    const {store} = useContext(Context)

    const {register, setValue, watch, getValues} = useForm<ProjectsProps>({
        defaultValues:{
            workingHours:{
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0,
            }
        }
    })
    const [isDisabled, setIsDisabled] = useState(true)
    const tdClassName = "whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]"
    const handleSelectChangeStatus = (value: any) => {
        setValue('workloadStatus', value.value);
        setSelectedStatus(value.value)
    };
    const [selectedStatus, setSelectedStatus] = useState('')

    const workloadStatus = useQuery(['workloadStatus', project.id, assessorId], () => AssessorService.fetchWorkloadStatus(assessorId, project.id), {
        onSuccess: data => {
            setValue('workloadStatus', data.results[0]?.status)
            setSelectedStatus(data.results[0]?.status)
        }
    })
    const getStatusValue = () => {
        return selectedStatus ? status.find(status => status.value === selectedStatus) : ''
    }
    const workingHours = useQuery(['workingHours', project.id, assessorId], () => AssessorService.fetchWorkingHours(assessorId, project.id), {
        onSuccess: data => {
            setValue('workingHours', data.results[0] ? data.results[0] : {} as WorkingHours)
        }
    })
    const queryClient = useQueryClient()
    const postWorkloadStatus = useMutation(['workloadStatus', project.id, assessorId], (data: {
        assessor: string | number | undefined,
        project: string | number,
        status: any
    }) => AssessorService.createWorkloadStatus(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workloadStatus')
            successNotification('Статус загрузки обновлен')
        }
    })
    const patchWorkloadStatus = useMutation(['workloadStatus', project.id, assessorId], ({id, data}: {
        id: string | number | undefined,
        data: any
    }) => AssessorService.patchWorkloadStatus(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workloadStatus')
            successNotification('Статус загрузки обновлен')
        }
    })
    const postWorkingHours = useMutation(['workingHours'], (data: WorkingHours) => AssessorService.createWorkingHours(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workingHours')
            successNotification('Рабочие часы обновлены')
        }
    })
    const patchWorkingHours = useMutation(['workingHours'], ({id, data}: {
        id: string | number,
        data: PatchWorkingHours
    }) => AssessorService.patchWorkingHours(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workingHours')
            successNotification('Рабочие часы обновлены')
        }
    })

    function edit() {
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            if (!!getValues('workloadStatus') && getValues('workloadStatus') !== workloadStatus.data?.results[0].status){
                if (workloadStatus.isSuccess && workloadStatus.data.results.length !== 0 && !!getValues('workloadStatus')) {
                    patchWorkloadStatus.mutate({
                        id: workloadStatus.data.results[0].id,
                        data: {status: getValues('workloadStatus')}
                    })
                } else {
                    postWorkloadStatus.mutate({
                        "assessor": assessorId,
                        "project": project.id,
                        "status": getValues('workloadStatus')
                    })
                }
            }

            if (workingHours.isSuccess && workingHours.data.results.length !== 0) {
                const data: WorkingHours = getValues('workingHours')
                console.log(data)
                if (isNaN(data.monday) || 0 > data.monday || data.monday > 24 ){
                    errorNotification('Рабочее время (ПН): Может быть только число от 0 до 24')
                    return
                }
                if (isNaN(data.tuesday) ||0 > data.tuesday || data.tuesday > 24 ){
                    errorNotification('Рабочее время (ВТ): Может быть только число от 1 до 24')
                    return;
                }
                if (isNaN(data.wednesday) ||0 > data.wednesday || data.wednesday > 24 ){
                    errorNotification('Рабочее время (СР): Может быть только число от 1 до 24')
                    return;
                }
                if (isNaN(data.thursday) || 0 > data.thursday || data.thursday > 24 ){
                    errorNotification('Рабочее время (ЧТ): Может быть только число от 1 до 24')
                    return;
                }
                if (isNaN(data.friday) ||0 > data.friday || data.friday > 24 ){
                    errorNotification('Рабочее время (ПТ): Может быть только число от 1 до 24')
                    return;
                }
                if (isNaN(data.saturday) || 0 > data.saturday || data.saturday > 24 ){
                    errorNotification('Рабочее время (СБ): Может быть только число от 1 до 24')
                    return;
                }
                if (isNaN(data.sunday) ||0 > data.sunday || data.sunday > 24 ){
                    errorNotification('Рабочее время (ВС): Может быть только число от 1 до 24')
                    return;
                }
                const {id, assessor, total, project, ...rest} = data

                patchWorkingHours.mutate({id: id, data: rest})
                setIsDisabled(true)
            } else {
                let wHours: any = getValues('workingHours')

                if (isNaN(wHours.monday) || 0 > wHours.monday || wHours.monday > 24 ){
                    errorNotification('Рабочее время (ПН): Может быть только число от 0 до 24')
                    return
                }
                if (isNaN(wHours.tuesday) ||0 > wHours.tuesday || wHours.tuesday > 24 ){
                    errorNotification('Рабочее время (ВТ): Может быть только число от 0 до 24')
                    return;
                }
                if (isNaN(wHours.wednesday) ||0 > wHours.wednesday || wHours.wednesday > 24 ){
                    errorNotification('Рабочее время (СР): Может быть только число от 0 до 24')
                    return;
                }
                if (isNaN(wHours.thursday) || 0 > wHours.thursday || wHours.thursday > 24 ){
                    errorNotification('Рабочее время (ЧТ): Может быть только число от 0 до 24')
                    return;
                }
                if (isNaN(wHours.friday) ||0 > wHours.friday || wHours.friday > 24 ){
                    errorNotification('Рабочее время (ПТ): Может быть только число от 0 до 24')
                    return;
                }
                if (isNaN(wHours.saturday) || 0 > wHours.saturday || wHours.saturday > 24 ){
                    errorNotification('Рабочее время (СБ): Может быть только число от 0 до 24')
                    return;
                }
                if (isNaN(wHours.sunday) ||0 > wHours.sunday || wHours.sunday > 24 ){
                    errorNotification('Рабочее время (ВС): Может быть только число от 0 до 24')
                    return;
                }
                wHours = {...wHours, project: project.id}
                wHours = {...wHours, assessor: assessorId}
                postWorkingHours.mutate({...wHours})

            }

        }
    }

    return (
        <tr className='border-b border-t border-black'>
            <td className={tdClassName + ' max-w-[200px] overflow-hidden'}><div className='break-words whitespace-normal'>{project.name}</div></td>
            <td className={tdClassName}>{project.manager.map(manager => {
                return <div key={manager.id}>{manager.last_name} {manager.first_name}</div>
            })}</td>
            <td className={tdClassName + ' w-[266px]'}>
                <Select
                    options={status}
                    {...register('workloadStatus')}
                    isSearchable={false}
                    value={getStatusValue()}
                    onChange={handleSelectChangeStatus} isDisabled={isDisabled}
                />
            </td>
            <td className={tdClassName + ' max-w-[8px]'}><input defaultValue={0} disabled={isDisabled}
                                               className='w-full text-center disabled:opacity-50' {...register('workingHours.monday')} />
            </td>
            <td className={tdClassName + ' max-w-[10px]'}><input defaultValue={0} disabled={isDisabled}
                                               className='w-full text-center disabled:opacity-50' {...register('workingHours.tuesday')} />
            </td>
            <td className={tdClassName + ' max-w-[10px]'}><input defaultValue={0} disabled={isDisabled}
                                               className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.wednesday')} />
            </td>
            <td className={tdClassName + ' max-w-[10px]'}><input defaultValue={0} disabled={isDisabled}
                                               className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.thursday')} />
            </td>
            <td className={tdClassName + ' max-w-[10px]'}><input defaultValue={0} disabled={isDisabled}
                                               className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.friday')} />
            </td>
            <td className={tdClassName + ' max-w-[10px]'}><input defaultValue={0} disabled={isDisabled}
                                               className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.saturday')} />
            </td>
            <td className={tdClassName + ' max-w-[10px]'}><input defaultValue={0} disabled={isDisabled}
                                               className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.sunday')} />
            </td>
            <td className={tdClassName + ' max-w-[10px]'}>{workingHours.data?.results[0]?.total ? workingHours.data?.results[0]?.total : 0}</td>
            <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">{project.manager.filter(manager => manager.id === store.user_id).length > 0 || project.manager.filter(manager => store.team.find(manId => manId.user.id === manager.id) !==undefined).length > 0? (isDisabled ?
                    <PencilSquareIcon onClick={edit}
                                      className="h-6 w-6 text-black cursor-pointer"/> :
                    <CheckIcon onClick={edit} className="h-6 w-6 text-black cursor-pointer"/>) :
                <PencilSquareIcon className="h-6 w-6 text-gray-400"/>}</td>
        </tr>
    );
};

export default AssessorProjectRow;