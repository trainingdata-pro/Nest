import React, {useContext, useEffect, useState} from 'react';
import {CheckIcon, PencilSquareIcon} from "@heroicons/react/24/solid";
import {IAssessorProjects, WorkingHours} from "../../models/AssessorResponse";
import {useForm} from "react-hook-form";
import Select, {SingleValue} from "react-select";
import AssessorService from "../../services/AssessorService";
import {Context} from "../../index";
type ProjectsProps = {
    workloadStatus: SingleValue<{ label: string; value: string | number; }> ,
    workingHours: WorkingHours
}
const AssessorProjectRow = ({project, assessorId}: { project: IAssessorProjects, assessorId: string|number|undefined }) => {
    const {store} = useContext(Context)
    const status = {
        'full': 'Полная загрузка',
        'partial' : 'Частичная загрузка',
        'reserved': 'Зарезервирован'
    }
    const [currentProject, setCurrentProject] = useState<IAssessorProjects>({...project})
    useEffect(() => {
        setValue('workingHours', {...currentProject.workingHours})
        setValue('workloadStatus', {label: status[currentProject.workloadStatus.status], value: currentProject.workloadStatus.status})
    }, [])
    const {register,setValue,watch, getValues} = useForm<ProjectsProps>()
    const [isDisabled, setIsDisabled] = useState(true)
    const tdClassName = "whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]"
    const handleSelectChangeStatus = (value: any) => {
        setValue('workloadStatus', value);
    };
    function edit() {
        if (isDisabled){
            setIsDisabled(false)
        } else{
            if (currentProject.workloadStatus?.id){
                AssessorService.patchWorkloadStatus(currentProject.workloadStatus.id, getValues('workloadStatus.value').toString()).then(
                    res => setCurrentProject({...currentProject, workloadStatus: res.data})
                )
            } else{
                AssessorService.createWorkloadStatus({
                    "assessor": assessorId,
                    "project": currentProject.id,
                    "status": getValues('workloadStatus.value').toString()
                }).then(
                    res => setCurrentProject({...currentProject, workloadStatus: res.data})
                )
            }
            if (currentProject.workingHours?.id){
                AssessorService.patchWorkingHours(currentProject.workingHours.id, getValues('workingHours')).then(
                    res => setCurrentProject({...currentProject, workingHours: res.data})
                )
            } else {
                const wHours = getValues('workingHours')
                let newWHours = {...wHours, project: currentProject.id}
                newWHours = {...newWHours, assessor: assessorId}

                AssessorService.createWorkingHours(newWHours).then(
                    res => setCurrentProject({...currentProject, workingHours: res.data})
                )
            }
            setIsDisabled(true)
        }
    }
    return (
        <tr className='border-b border-t border-black'>
            <td className={tdClassName}>{currentProject.name}</td>
            <td className={tdClassName}>{currentProject.manager.map(manager => {return <div key={manager.id}>{manager.last_name} {manager.first_name}</div>})}</td>
            <td className={tdClassName + ' w-[266px]'}>
                <Select
                    options={[
                        {label: 'Полная загрузка', value: 'full'},
                        {label: 'Частичная загрузка', value: 'partial'},
                        {label: 'Свободен', value: 'reserved'}]}
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
            <td className={tdClassName}>{currentProject.workingHours?.total ? currentProject.workingHours.total : 0}</td>
            <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">{currentProject.manager.filter(manager => manager.id === store.user_id).length > 0 ? ( isDisabled ? <PencilSquareIcon onClick={edit}
                                  className="h-6 w-6 text-black cursor-pointer"/> : <CheckIcon onClick={edit} className="h-6 w-6 text-black cursor-pointer"/>): ''}</td>
        </tr>
    );
};

export default AssessorProjectRow;