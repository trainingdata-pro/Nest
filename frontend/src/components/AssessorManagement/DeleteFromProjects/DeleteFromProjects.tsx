import React, {Dispatch, useState} from 'react';
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../services/AssessorService";
import MyButton from "../../UI/MyButton";
import "react-toastify/dist/ReactToastify.css";
import {successNotification, errorNotification} from "../../UI/Notify";
import {Row} from "@tanstack/react-table";
import {Assessor} from "../../../models/AssessorResponse";
import {Project} from "../../../models/ProjectResponse";

interface DeleteFromProjectsProps {
    projectId: number | string,
    assessorsProjects: Row<Assessor>[],
    close: Dispatch<boolean>
}

const DeleteFromProjects = ({projectId, assessorsProjects, close}: DeleteFromProjectsProps) => {
    const queryClient = useQueryClient()
    const deleteFromProject = useMutation([], ({id, data}:any) => AssessorService.addAssessorProject(id,data))
    const [selectedReason, setSelectedReason] = useState<string>()
    const submit = ()=> {
        if (selectedReason){
            assessorsProjects.forEach((row:any) => {
                const newProjects = row.original.projects.filter((pr: Project) => pr.id.toString() !== projectId.toString()).map((project:Project) => project.id)
                deleteFromProject.mutate({
                        id: row.original.id,
                        data: {
                            projects: newProjects,
                            reason: selectedReason
                        }
                    },
                    {
                        onSuccess: () => {
                            queryClient.invalidateQueries('projectAssessors')
                            close(false)
                            successNotification('Ассессор(ы) успешно убраны с проекта')
                        }
                    })


            })
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
            <div className='flex justify-between space-x-2'>
                <MyButton onClick={() => close(false)}>Назад</MyButton>
                <MyButton onClick={submit}>Применить</MyButton>
            </div>
        </div>
    );
};

export default DeleteFromProjects;