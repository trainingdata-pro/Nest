import React from 'react';
import MyButton from "../../UI/MyButton";
import {useMutation} from "react-query";
import ProjectService from "../../../services/ProjectService";

const SetCompleted = ({projectId, show}:{projectId: string | number, show:any}) => {
    const completeProject = useMutation([], () => ProjectService.patchProject(projectId, {status: 'completed'}))
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