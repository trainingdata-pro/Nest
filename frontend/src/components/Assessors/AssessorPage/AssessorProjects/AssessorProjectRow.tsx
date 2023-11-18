import React, {useContext, useState} from 'react';
import {CheckIcon, PencilSquareIcon} from "@heroicons/react/24/outline";
import {PatchWorkingHours, WorkingHours} from "../../../../models/AssessorResponse";
import {useForm} from "react-hook-form";
import Select from "react-select";
import AssessorService from "../../../../services/AssessorService";
import {Context} from "../../../../index";
import {useMutation, useQueryClient} from "react-query";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {AxiosError} from "axios";
import {AssessorRowProps} from "./AssessorProjects";
import {usePatchWorkingHours, usePatchWorkloadStatus, usePostWorkingHours, usePostWorkloadStatus} from "./queries";



type ProjectsProps = {
    project: number | string,
    workloadStatus: string,
    workingHours: WorkingHours
}
const status = [
    {value: 'full', label:'Полная загрузка'},
    {value: 'partial', label: 'Частичная загрузка'},
    {value: 'reserved', label: 'Зарезервирован'}
]
const AssessorProjectRow = ({project, assessorId}: {
    project: AssessorRowProps,
    assessorId: string | number | undefined
}) => {
    const {store} = useContext(Context)

    const {register, setValue, getValues} = useForm<ProjectsProps>({
        defaultValues: {
            workloadStatus: project.workloadStatus?.status,
            workingHours: project.workingHours
        }
    })
    const [isDisabled, setIsDisabled] = useState(true)
    const tdClassName = "whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]"
    const handleSelectChangeStatus = (value: any) => {
        setValue('workloadStatus', value.value);
        setSelectedStatus(value.value)
    };
    const [selectedStatus, setSelectedStatus] = useState(project.workloadStatus?.status)
    const getStatusValue = () => {
        return selectedStatus ? status.find(status => status.value === selectedStatus) : ''
    }
    const patchWorkingHours = usePatchWorkingHours({setIsDisabled})
    const postWorkloadStatus = usePostWorkloadStatus({setIsDisabled})
    const patchWorkloadStatus = usePatchWorkloadStatus({setIsDisabled})
    const postWorkingHours = usePostWorkingHours({setIsDisabled})


    function edit() {
        if (isDisabled) {
            setIsDisabled(false)
        } else {
            if (getValues('workloadStatus')) {
                if (!!project.workloadStatus && !!getValues('workloadStatus')) {
                    patchWorkloadStatus.mutate({
                        id: project.workloadStatus.id,
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

            if (!!project.workingHours) {
                const data: WorkingHours = getValues('workingHours')
                const {id, assessor, total, project, ...rest} = data

                patchWorkingHours.mutate({id: id, data: rest})
            } else {

                let wHours: any = getValues('workingHours')
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
                    placeholder='Статус'
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
            <td className={tdClassName + ' max-w-[10px]'}>{project.workingHours?.total}</td>
            <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">{project.manager.filter(manager => manager.id === store.user_id).length > 0 || project.manager.filter(manager => store.team.find(manId => manId.user.id === manager.id) !==undefined).length > 0? (isDisabled ?
                    <PencilSquareIcon onClick={edit}
                                      className="h-6 w-6 text-black cursor-pointer"/> :
                    <CheckIcon onClick={edit} className="h-6 w-6 text-black cursor-pointer"/>) :
                <PencilSquareIcon className="h-6 w-6 text-gray-400"/>}</td>
        </tr>
    );
};

export default AssessorProjectRow;