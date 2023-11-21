import React, {useState} from 'react';
import Datepicker from "react-tailwindcss-datepicker";
import AssessorService from "../../../services/AssessorService";
import Select from "react-select";
import MyButton from "../../UI/MyButton";
import { useCalendar, useReason } from './hooks';
import { useAddAssessorToFired } from './queries';

const Fired = ({assessorId, close}: {
    assessorId: number | string,
    close: any
}) => {

    const [isOpenCalendar, setIsOpenCalendar] = useState(false)
    const {reasonList,selectedReason, onChangeReason, getValueReason, checkBlackList} = useReason({setIsOpenCalendar})
    const {addAssessorToFired} = useAddAssessorToFired({close: close, assessorId: assessorId})
    const {calendarValue, handleValueCalendarChange} = useCalendar()
    
    const onSubmit = () => {
        if (calendarValue.endDate){
            addAssessorToFired.mutate({id: assessorId, data: {date: calendarValue.endDate, reason: selectedReason}})
        } else {
            addAssessorToFired.mutate({id: assessorId, data: {reason: selectedReason}})
        }
        close(false)
    }
    return (
        <div className='w-[25rem]'>
            <div className='w-full h-[200px]'>
                <h1 className='px-4 border-b border-black mb-2'>Увольнение</h1>
                <Select
                    options={reasonList}
                    isSearchable={false}
                    placeholder='Выберите причину увольнения'
                    value={getValueReason()}
                    onChange={onChangeReason}
                />
                <div className='h-[70px] my-3'>
                {isOpenCalendar && <div>
                    <h2 className='px-4'>Предполагаемая дата возвращения</h2>
                    <Datepicker
                        i18n={'ru'}
                        useRange={false}
                        asSingle={true}
                        value={calendarValue}
                        onChange={handleValueCalendarChange}
                    />
                </div>}
                    {checkBlackList(selectedReason) && <p className='text-red-600'>Выбрав эту причину асессор попадет в черный список</p>}
                </div>
                <div className='flex justify-between space-x-2 mt-3'>
                    <MyButton onClick={() => close(false)}>Назад</MyButton>
                    <MyButton onClick={() => onSubmit()}>Сохранить</MyButton>
                </div>
            </div>
        </div>
    );
};

export default Fired;