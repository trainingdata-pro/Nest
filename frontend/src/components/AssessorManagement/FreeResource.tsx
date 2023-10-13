import React, {useEffect, useState} from 'react';
import Dialog from "../UI/Dialog";
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";
import {errorNotification, successNotification} from "../UI/Notify";
interface Props {
    assessorId: any,
    data:any
}
const FreeResource = ({assessorId, setShowAddToFreeResource}: {
    assessorId: string | number | undefined,
    setShowAddToFreeResource: any
}) => {
    const status = {
        free_time: 'Есть свободное время',
        project_reduction: 'Сокращение проекта',
        project_mismatch: 'Не подходит текущему проекту'
    }
    const [capacity, setCapacity] = useState({
        "free_resource_day_off_hours": '',
        "free_resource_weekday_hours": '',
        "reason": '',
        "free_resource": true
    })
    const queryClient = useQueryClient()
    const addToFreeResource = useMutation(['currentAssessor', assessorId], ({assessorId, data}: Props) => AssessorService.addToFreeResource(assessorId, data),{
        onSuccess: () => {
            queryClient.invalidateQueries(['currentAssessor', assessorId])
            queryClient.invalidateQueries(['assessorHistory', assessorId])
            successNotification('Ассесор успешно добавлен в свободные ресурсы')
            setShowAddToFreeResource(false)
        },
        onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            console.log(jsonError[Object.keys(jsonError)[0]])
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])}
    })
    const submit = () => {
        addToFreeResource.mutate({assessorId:assessorId, data: capacity})
    }
    return (
            <div className='px-4'>
                <div className='border-b border-black w-full'>
                    <h1 className='px-4 py-2'>Добавление в свободные ресурсы</h1>
                </div>
                <div>
                    <p>Время работы</p>
                </div>
                <div className='flex justify-between'>
                    <div className='flex flex-col'>
                        <p>Будние</p>
                        <div>
                            <input className='outline-none' name='free_resource_weekday_hours' onChange={(event) => setCapacity({
                                ...capacity,
                                [event.target.name]: event.target.value
                            })} id='day1' type="radio" value='2-4'/>
                            <label htmlFor='day1'>2-4 часа</label>
                        </div>
                        <div>
                            <input name='free_resource_weekday_hours' onChange={(event) => setCapacity({
                                ...capacity,
                                [event.target.name]: event.target.value
                            })} id='day2' type="radio" value='4-6'/>
                            <label htmlFor='day2'>4-6 часа</label>
                        </div>
                        <div>
                            <input name='free_resource_weekday_hours' onChange={(event) => setCapacity({
                                ...capacity,
                                [event.target.name]: event.target.value
                            })} id='day3' type="radio" value='6-8'/>
                            <label htmlFor='day3'>6-8 часа</label>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <p>Выходные</p>
                        <div>
                            <input className='outline-none' name='free_resource_day_off_hours' onChange={(event) => setCapacity({
                                ...capacity,
                                [event.target.name]: event.target.value
                            })} id='weekday1' type="radio" value='0'/>
                            <label htmlFor='weekday1'>0 часов</label>
                        </div>
                        <div>
                            <input name='free_resource_day_off_hours' onChange={(event) => setCapacity({
                                ...capacity,
                                [event.target.name]: event.target.value
                            })} id='weekday2' type="radio" value='2-4'/>
                            <label htmlFor='weekday2'>2-4 часа</label>
                        </div>
                        <div>
                            <input name='free_resource_day_off_hours' onChange={(event) => setCapacity({
                                ...capacity,
                                [event.target.name]: event.target.value
                            })} id='weekday3' type="radio" value='4-6'/>
                            <label htmlFor='weekday3'>4-6 часа</label>
                        </div>
                        <div>
                            <input name='free_resource_day_off_hours' onChange={(event) => setCapacity({
                                ...capacity,
                                [event.target.name]: event.target.value
                            })} id='weekday4' type="radio" value='6-8'/>
                            <label htmlFor='weekday4'>6-8 часа</label>
                        </div>
                    </div>
                </div>
                <div>
                    <select className='outline-none border border-black' name='reason' required
                            onChange={(event) => setCapacity({...capacity, [event.target.name]: event.target.value})}>
                        <option className='opacity-50' selected disabled>Выберите причину</option>
                        <option value="free_time">{status.free_time}</option>
                        <option value="project_reduction">{status.project_reduction}</option>
                        <option value="project_mismatch">{status.project_mismatch}</option>
                    </select>
                </div>
                <div className='flex space-x-2'>
                    <button className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2">Назад</button>
                    <button className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2" onClick={submit}>Применить</button>
                </div>
            </div>
    );
};

export default FreeResource;