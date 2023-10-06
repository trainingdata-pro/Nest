import React, {useState} from 'react';
import Datepicker from "react-tailwindcss-datepicker";
import {useMutation, useQuery} from "react-query";
import AssessorService from "../../services/AssessorService";
import Select from "react-select";

const Fired = ({assessorId, close}: {
    assessorId: number | string | undefined,
    close: any
}) => {
    const reasons = useQuery(['reasons'], () => AssessorService.fetchReasons(), {
        onSuccess: data => setOptions(data.results.map(reason => {
            return {label: reason.title, value: reason.id}
        }))
    })
    const addAssessorToFired = useMutation(['currentAssessor', assessorId], ({id, data}: any) => AssessorService.addAssessorToFired(id, data))
    const [options, setOptions] = useState<any[]>([])
    const [selectedReason, setSelectedReason] = useState<number>()
    const [isOpenCalendar, setIsOpenCalendar] = useState(false)
    const checkBlackList = (value: string) => {
        return reasons.data?.results.find(reason => reason.id.toString() === value.toString())?.blacklist_reason
    }
    const onChangeReason = (newValue: any) => {
        setSelectedReason(newValue.value)
        if (!checkBlackList(newValue.value)) {
            setIsOpenCalendar(true)
        } else {
            setIsOpenCalendar(false)
        }
    }
    const getValueReason = () => {
        return selectedReason ? options.find(reason => reason.value === selectedReason) : ''
    }
    const [calendarValue, setCalendarValue] = useState({
        startDate: null,
        endDate: null
    });
    const handleValueCalendarChange = (newValue: any) => {
        setCalendarValue(newValue);
    }
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
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Увольнение</h1>
                <Select
                    options={options}
                    value={getValueReason()}
                    onChange={onChangeReason}
                />
                {isOpenCalendar && <div className='my-3'>
                    <h2 className='px-4'>Предполагаемая дата возвращения</h2>
                    <Datepicker
                        containerClassName=''
                        i18n={'ru'}
                        useRange={false}
                        asSingle={true}
                        value={calendarValue}
                        onChange={handleValueCalendarChange}
                    /></div>}
                <div className='flex space-x-2'>
                    <button className='bg-[#5970F6] text-white w-full rounded-md mt-2 py-2'
                            onClick={() => close(false)}>Назад
                    </button>
                    <button className='bg-[#5970F6] text-white w-full rounded-md mt-2 py-2'
                            onClick={() => onSubmit()}>Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Fired;