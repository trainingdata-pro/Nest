import React, {useState} from 'react';
import {errorNotification,} from "../../../UI/Notify";
import MyButton from "../../../UI/MyButton";
import {useSetFreeResource} from "./queries";
import Dialog from '../../../UI/Dialog';
import {Props} from "../../Management";
import {FREE_RESOURCE_REASONS} from "../../../../assets/consts";


const FreeResource = ({assessorId, setIsOpenDropDown, ...props}: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [capacity, setCapacity] = useState({
        free_resource_day_off_hours: '',
        free_resource_weekday_hours: '',
        reason: '',
        free_resource: true
    })
    const handleClick = () => {
        setIsOpenDropDown(false)
        setIsOpen(true)
    }
    const {mutate} = useSetFreeResource({assessorId, setShowAddToFreeResource: setIsOpen})
    const submit = () => {
        if (capacity.free_resource_weekday_hours === ''){
            errorNotification('Выберите рабочее время в будние дни')
        } else if (capacity.free_resource_day_off_hours === '') {
            errorNotification('Выберите рабочее время в выходные дни')
        } else if (capacity.reason === "") {
            errorNotification('Выберите причину')
        } else {
            mutate({assessorId:assessorId, data: capacity})
        }
    }
    return (
        <>
            <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
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
                                <input className='outline-none' name='free_resource_weekday_hours'
                                       onChange={(event) => setCapacity({
                                           ...capacity,
                                           [event.target.name]: event.target.value
                                       })} id='day1' type="radio" value='2-4'/>
                                <label className='pl-[5px]' htmlFor='day1'>2-4 часа</label>
                            </div>
                            <div>
                                <input name='free_resource_weekday_hours' onChange={(event) => setCapacity({
                                    ...capacity,
                                    [event.target.name]: event.target.value
                                })} id='day2' type="radio" value='4-6'/>
                                <label className='pl-[5px]' htmlFor='day2'>4-6 часа</label>
                            </div>
                            <div>
                                <input name='free_resource_weekday_hours' onChange={(event) => setCapacity({
                                    ...capacity,
                                    [event.target.name]: event.target.value
                                })} id='day3' type="radio" value='6-8'/>
                                <label className='pl-[5px]' htmlFor='day3'>6-8 часа</label>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <p>Выходные</p>
                            <div>
                                <input className='outline-none' name='free_resource_day_off_hours'
                                       onChange={(event) => setCapacity({
                                           ...capacity,
                                           [event.target.name]: event.target.value
                                       })} id='weekday1' type="radio" value='0'/>
                                <label className='pl-[10px]' htmlFor='weekday1'>0 часов</label>
                            </div>
                            <div>
                                <input name='free_resource_day_off_hours' onChange={(event) => setCapacity({
                                    ...capacity,
                                    [event.target.name]: event.target.value
                                })} id='weekday2' type="radio" value='2-4'/>
                                <label className='pl-[5px]' htmlFor='weekday2'>2-4 часа</label>
                            </div>
                            <div>
                                <input name='free_resource_day_off_hours' onChange={(event) => setCapacity({
                                    ...capacity,
                                    [event.target.name]: event.target.value
                                })} id='weekday3' type="radio" value='4-6'/>
                                <label className='pl-[5px]' htmlFor='weekday3'>4-6 часа</label>
                            </div>
                            <div>
                                <input name='free_resource_day_off_hours' onChange={(event) => setCapacity({
                                    ...capacity,
                                    [event.target.name]: event.target.value
                                })} id='weekday4' type="radio" value='6-8'/>
                                <label className='pl-[5px]' htmlFor='weekday4'>6-8 часа</label>
                            </div>
                        </div>
                    </div>
                    <div className='my-4'>
                        <select className='outline-none border border-black w-full' name='reason' required
                                defaultValue={""}
                                onChange={(event) => setCapacity({
                                    ...capacity,
                                    [event.target.name]: event.target.value
                                })}>
                            <option className='opacity-50' value="" disabled>Выберите причину</option>
                            <option value="free_time">{FREE_RESOURCE_REASONS.free_time}</option>
                            <option value="project_reduction">{FREE_RESOURCE_REASONS.project_reduction}</option>
                            <option value="project_mismatch">{FREE_RESOURCE_REASONS.project_mismatch}</option>
                        </select>
                    </div>
                    <div className='flex justify-between space-x-2'>
                        <MyButton className='min-w-[120px]' onClick={() => setIsOpen(false)}>Назад</MyButton>
                        <MyButton className='min-w-[120px]' onClick={submit}>Применить</MyButton>
                    </div>
                </div>
            </Dialog>
            <div onClick={() => handleClick()} className='w-full' {...props}>
                Отправить в свободные ресурсы
            </div>
        </>
    );
};

export default FreeResource;