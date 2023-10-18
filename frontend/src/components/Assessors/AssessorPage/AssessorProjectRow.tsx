import React, {useContext, useEffect, useState} from 'react';
import {CheckIcon, PencilSquareIcon} from "@heroicons/react/24/outline";
import {IAssessorProjects, PatchWorkingHours, WorkingHours} from "../../models/AssessorResponse";
import {useForm} from "react-hook-form";
import Select, {SingleValue} from "react-select";
import AssessorService from "../../services/AssessorService";
import {Context} from "../../index";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Project} from "../../models/ProjectResponse";
type ProjectsProps = {
    workloadStatus: SingleValue<{ label: string; value: string | number}> ,
    workingHours: WorkingHours
}
const status = {
    'full': 'Полная загрузка',
    'partial' : 'Частичная загрузка',
    'reserved': 'Зарезервирован'
}
const AssessorProjectRow = ({project, assessorId}: { project: IAssessorProjects, assessorId: string|number|undefined }) => {
    const {store} = useContext(Context)

    const {register,setValue,watch, getValues} = useForm<ProjectsProps>()
    const [isDisabled, setIsDisabled] = useState(true)
    const tdClassName = "whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]"
    const handleSelectChangeStatus = (value: any) => {
        setValue('workloadStatus', value);
    };
    const workloadStatus = useQuery(['workloadStatus', project.id, assessorId], () => AssessorService.fetchWorkloadStatus(assessorId, project.id), {
        onSuccess: data => {
            if (data.results.length !== 0) setValue('workloadStatus', {label: status[data.results[0].status], value: data.results[0].status})
        }
    })
    const workingHours = useQuery(['workingHours', project.id, assessorId], () => AssessorService.fetchWorkingHours(assessorId, project.id), {
        onSuccess: data => {
            setValue('workingHours', data.results[0] ? data.results[0] : {} as WorkingHours)
        }
    })
    const queryClient = useQueryClient()
    const postWorkloadStatus = useMutation(['workloadStatus', project.id, assessorId], (data:{assessor:string|number | undefined, project: string|number, status:any}) => AssessorService.createWorkloadStatus(data),{
        onSuccess: () => {
            queryClient.invalidateQueries('workloadStatus')
        }
    })
    const patchWorkloadStatus = useMutation(['workloadStatus', project.id, assessorId], ({id, data}: {id:string|number|undefined,data: any }) => AssessorService.patchWorkloadStatus(id,data),{
        onSuccess: () => {
            queryClient.invalidateQueries('workloadStatus')
        }
    })
    const postWorkingHours = useMutation(['workingHours'], (data:WorkingHours) => AssessorService.createWorkingHours(data),{
        onSuccess: () => {
            queryClient.invalidateQueries('workingHours')
        }
    })
    const patchWorkingHours = useMutation(['workingHours'], ({id, data}: {id:string|number, data: PatchWorkingHours } ) => AssessorService.patchWorkingHours(id,data),{
        onSuccess: () => {
            queryClient.invalidateQueries('workingHours')
        }
    })
    function edit() {
        if (isDisabled){
            setIsDisabled(false)
        } else{
            if (workloadStatus.isSuccess && workloadStatus.data.results.length !== 0 && !!getValues('workloadStatus')){
                patchWorkloadStatus.mutate({id:workloadStatus.data.results[0].id, data:getValues('workloadStatus.value')})
            } else{
                postWorkloadStatus.mutate({
                    "assessor": assessorId,
                    "project": project.id,
                    "status": getValues('workloadStatus.value')
                })
            }
            if (workingHours.isSuccess && workingHours.data.results.length !== 0){
                const data:WorkingHours = getValues('workingHours')
                const {id, assessor, total,  project, ...rest} = data

                patchWorkingHours.mutate({id: id, data:rest})
            } else {
                let wHours:any = getValues('workingHours')
                wHours = {...wHours, project: project.id}
                wHours = {...wHours, assessor: assessorId}
                postWorkingHours.mutate({...wHours})

            }
            setIsDisabled(true)
        }
    }
    return (
        <tr className='border-b border-t border-black'>
            <td className={tdClassName}>{project.name}</td>
            <td className={tdClassName}>{project.manager.map(manager => {return <div key={manager.id}>{manager.last_name} {manager.first_name}</div>})}</td>
            <td className={tdClassName + ' w-[266px]'}>
                <Select
                    options={[
                        {label: 'Полная загрузка', value: 'full'},
                        {label: 'Частичная загрузка', value: 'partial'},
                        {label: 'Зарезервирован', value: 'reserved'}]}
                    {...register('workloadStatus')}
                    isSearchable={false}
                    value={watch('workloadStatus')}
                    onChange={handleSelectChangeStatus} isDisabled={isDisabled}
                />
            </td>
            <td className={tdClassName}><input defaultValue={0} disabled={isDisabled} className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.monday')} /></td>
            <td className={tdClassName}><input defaultValue={0} disabled={isDisabled} className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.tuesday')} /></td>
            <td className={tdClassName}><input defaultValue={0} disabled={isDisabled} className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.wednesday')} /></td>
            <td className={tdClassName}><input defaultValue={0} disabled={isDisabled} className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.thursday')} /></td>
            <td className={tdClassName}><input defaultValue={0} disabled={isDisabled} className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.friday')} /></td>
            <td className={tdClassName}><input defaultValue={0} disabled={isDisabled} className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.saturday')} /></td>
            <td className={tdClassName}><input defaultValue={0} disabled={isDisabled} className='w-[25px] text-center disabled:opacity-50' {...register('workingHours.sunday')} /></td>
            <td className={tdClassName}>{workingHours.data?.results[0]?.total}</td>
            <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">{project.manager.filter(manager => manager.id === store.user_id).length > 0 ? ( isDisabled ? <PencilSquareIcon onClick={edit}
                                  className="h-6 w-6 text-black cursor-pointer"/> : <CheckIcon onClick={edit} className="h-6 w-6 text-black cursor-pointer"/>): <PencilSquareIcon className="h-6 w-6 text-gray-400"/>}</td>
        </tr>
    );
};

export default AssessorProjectRow;