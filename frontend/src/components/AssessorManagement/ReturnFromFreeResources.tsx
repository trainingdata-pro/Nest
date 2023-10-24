import React, {useEffect} from 'react';
import MyButton from '../UI/MyButton';
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";
import {errorNotification, successNotification} from "../UI/Notify";

const ReturnFromFreeResources = ({assessorId, show}:{assessorId:string|number|undefined, show:any}) => {
    useEffect(() => {
        document.title = 'Вернуть из свободных ресурсов'
    }, []);
    const queryClient = useQueryClient()
    const returnFromFreeResources = useMutation(['currentAssessor', assessorId], () => AssessorService.returnFromFreeResources(assessorId, {free_resource:false}),{
        onSuccess: () => {
            queryClient.invalidateQueries(['currentAssessor', assessorId])
            queryClient.invalidateQueries(['assessorHistory', assessorId])
            queryClient.invalidateQueries('freeResources')
            successNotification('Ассессор возвращен в команду')
            show(false)
        }, onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])}
    })
    const submit = () => {
        returnFromFreeResources.mutate()
    }
    return (
        <div className='px-4'>
            <div className='border-b border-black w-full'>
                <h1 className='px-4 py-2'>Вернуть из свободных ресурсов</h1>
            </div>
            <div className="my-2">
                <p>Вы уверены, что хотите вернуть ассессора из свободных ресурсов?</p>
            </div>
            <div className='flex space-x-2'>
                <MyButton onClick={() => show(false)}>Назад</MyButton>
                <MyButton onClick={submit}>Применить</MyButton>
            </div>
        </div>
    );
};

export default ReturnFromFreeResources;