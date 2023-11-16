import {useMutation, useQueryClient} from "react-query";
import ProjectService from "../../../services/ProjectService";
import {errorNotification, successNotification} from "../../UI/Notify";
import MyButton from "../../UI/MyButton";
import React from "react";

const SetActive = ({projectId, show}:{projectId: string | number, show:any}) => {
    const queryClient = useQueryClient()
    const completeProject = useMutation([], () => ProjectService.patchProjectStatus(projectId, {status: 'active'}), {
        onSuccess: () => {
            queryClient.invalidateQueries('projects')
            queryClient.invalidateQueries('projectInfo')
            successNotification('Проект переведен в статус "Активный"')
            show(false)
        },
        onError: () => {
            errorNotification('Ошибка')
        }
    })
    const submit =() => {
        completeProject.mutate()
    }

    return (
        <div className='px-4'>
            <div className='border-b border-black w-full'>
                <h1 className='px-4 py-2'>Активировать проект проект</h1>
            </div>
            <div className="my-2">
                <p>Вы уверены, что хотите перевести проект в статус "Активный"?</p>
            </div>
            <div className='flex justify-between space-x-2'>
                <MyButton onClick={() => show(false)}>Назад</MyButton>
                <MyButton onClick={submit}>Применить</MyButton>
            </div>
        </div>
    );
};

export default SetActive;