import React, {useState} from 'react';
import Datepicker from "react-tailwindcss-datepicker";
import Select from "react-select";
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";

// @ts-ignore
const DeleteFromProjects = ({projectId, assessorsProjects, close}) => {
    const queryClient = useQueryClient()
    const deleteFromProject = useMutation([], ({id, data}:any) => AssessorService.addAssessorProject(id,data), {
        onSuccess: () => queryClient.invalidateQueries('projectAssessors')
    })
    const options = [
        {label: 'Не смог работать со спецификой проекта', value: 'Не смог работать со спецификой проекта'},
        {label: 'Не сработались', value: 'Не сработались'},
        {label: 'Не понадобился', value: 'Не понадобился'},]

    const [selectedReason, setSelectedReason] = useState<string>()
    const getValueReason = () => {
        return selectedReason ? options.find(reason => reason.value === selectedReason) : ''
    }

    const onChangeReason = (newValue: any) => {
        setSelectedReason(newValue.value)
    }
    const submit =()=> {
        Object.keys(assessorsProjects).map(key => deleteFromProject.mutate({id:key, data:{projects: assessorsProjects[key].filter((pr:any) => pr.toString() !== projectId.toString()), reason: selectedReason}}))
        close(false)
    }
    return (
        <div className='px-4'>
            <div className='border-b border-black w-full'>
                <h1 className='px-4'>Убрать с проекта</h1>
            </div>
            <Select
                options={options}
                value={getValueReason()}
                onChange={onChangeReason}
            />
            <div className='flex space-x-2'>
                <button className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2" onClick={() => close(true)}>Назад</button>
                <button className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2" onClick={submit}>Применить</button>
            </div>
        </div>
    );
};

export default DeleteFromProjects;