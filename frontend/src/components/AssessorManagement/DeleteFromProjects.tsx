import React, {useState} from 'react';
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";
import MyButton from "../UI/MyButton";
import "react-toastify/dist/ReactToastify.css";
import {successNotification, errorNotification} from "../UI/Notify";
// @ts-ignore
const DeleteFromProjects = ({projectId, assessorsProjects, close}) => {
    const queryClient = useQueryClient()
    const deleteFromProject = useMutation([], ({id, data}:any) => AssessorService.addAssessorProject(id,data), {
        onSuccess: () => {
            queryClient.invalidateQueries('projectAssessors')
            successNotification('Ассессор(ы) успешно убраны с проекта')
        }
    })
    const [selectedReason, setSelectedReason] = useState<string>()
    const submit = ()=> {
        if (selectedReason){
            Object.keys(assessorsProjects).map(key => deleteFromProject.mutate({id:key, data:{projects: assessorsProjects[key].filter((pr:any) => pr.toString() !== projectId.toString()), reason: selectedReason}}))
            close(false)
        } else {
            errorNotification('Выберите причину')
        }

    }
    return (
        <div className='px-4'>

            <div className='border-b border-black w-full'>
                <h1 className='px-4'>Убрать с проекта</h1>
            </div>
            <div className='flex justify-start'>
                <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason1' type="radio" value='Не смог работать со спецификой проекта'/>
                <label htmlFor='reason1'>Не смог работать со спецификой проекта</label>
            </div>
            <div className='flex justify-start'>
                <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason2' type="radio" value='Не сработались'/>
                <label htmlFor='reason2'>Не сработались</label>
            </div>
            <div className='flex justify-start'>
                <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason3' type="radio" value='Не понадобился'/>
                <label htmlFor='reason3'>Не понадобился</label>
            </div>
            <div className='flex space-x-2'>
                <MyButton onClick={() => close(true)}>Назад</MyButton>
                <MyButton onClick={submit}>Применить</MyButton>
            </div>
        </div>
    );
};

export default DeleteFromProjects;