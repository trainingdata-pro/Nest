import React, {Dispatch, useState} from 'react';
import MyButton from "../../UI/MyButton";
import {errorNotification, successNotification} from "../../UI/Notify";
import {useMutation, useQueryClient} from "react-query";
import ProjectService from "../../../services/ProjectService";
import {useNavigate} from "react-router-dom";

const SetPause = ({show, projectId}: {
    show: Dispatch<boolean>,
    projectId: number | string
}) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [value, setValue] = useState<boolean>()
    const pauseProject = useMutation([], () => ProjectService.patchProject(projectId, {status: 'pause'}), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects')
            queryClient.invalidateQueries('completedProjects')
            successNotification('Проект поставлен на паузу')
            navigate('/projects')
        },
        onError: () => {
            errorNotification('Ошибка')
        }
    })
    const submit =() => {
        if (value === undefined){
            errorNotification('Выберите причину')
        } else {
            if (value){

            } else {
                pauseProject.mutate()
            }
        }
    }
    return (
        <div className='px-4'>
            <div className='border-b border-black w-full'>
                <h1 className='px-4 py-2'>Завершить проект</h1>
            </div>
            <div className="my-2">
                <div className='flex justify-start'>
                    <input name='reason' onChange={() => setValue(true)} id='1' type="radio"/>
                    <label htmlFor='1'>Снять всех асессеров с проекта</label>
                </div>
                <div className='flex justify-start'>
                    <input name='reason' onChange={() => setValue(false)} id='2' type="radio"/>
                    <label htmlFor='2'>Оставить асессеров на проекте</label>
                </div>
            </div>
            <div className='flex justify-between space-x-2'>
                <MyButton onClick={() => show(false)}>Назад</MyButton>
                <MyButton onClick={submit}>Применить</MyButton>
            </div>
        </div>
    );
};

export default SetPause;