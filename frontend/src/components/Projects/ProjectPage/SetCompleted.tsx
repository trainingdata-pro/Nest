import React from 'react';
import MyButton from "../../UI/MyButton";
import {useMutation, useQueryClient} from "react-query";
import ProjectService from "../../../services/ProjectService";
import {useNavigate} from "react-router-dom";
import {errorNotification, successNotification} from "../../UI/Notify";

const SetCompleted = ({projectId, show}:{projectId: string | number, show:any}) => {
    const queryClient = useQueryClient()
    const completeProject = useMutation([], () => ProjectService.patchProjectStatus(projectId, {status: 'completed'}), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects')
            queryClient.invalidateQueries('completedProjects')
            successNotification('Проект завершен')
            navigate('/projects')
        },
        onError: () => {
            errorNotification('Ошибка')
        }
    })
    const navigate = useNavigate()
    const submit =() => {
        completeProject.mutate()
    }

    return (
        <div className='px-4'>
            <div className='border-b border-black w-full'>
                <h1 className='px-4 py-2'>Завершить проект</h1>
            </div>
            <div className="my-2">
                <p>Вы уверены, что хотите завершить проект?</p>
            </div>
            <div className='flex justify-between space-x-2'>
                <MyButton onClick={() => show(false)}>Назад</MyButton>
                <MyButton onClick={submit}>Применить</MyButton>
            </div>
        </div>
    );
};

export default SetCompleted;