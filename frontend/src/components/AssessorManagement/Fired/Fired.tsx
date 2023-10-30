import React, {useState} from 'react';
import Datepicker from "react-tailwindcss-datepicker";
import {useMutation, useQuery, useQueryClient} from "react-query";
import AssessorService from "../../../services/AssessorService";
import Select from "react-select";
import {errorNotification, successNotification} from "../../UI/Notify";
import {useNavigate} from "react-router-dom";
import MyButton from "../../UI/MyButton";

const Fired = ({assessorId, close}: {
    assessorId: number | string | undefined,
    close: any
}) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const reasons = useQuery(['reasons'], () => AssessorService.fetchReasons(), {
        onSuccess: data => setOptions(data.results.map(reason => {
            return {label: reason.title, value: reason.id}
        }))
    })
    const addAssessorToFired = useMutation(['currentAssessor', assessorId], ({id, data}: any) => AssessorService.addAssessorToFired(id, data),{
        onSuccess: () => {
            queryClient.invalidateQueries('assessorHistory')
            queryClient.invalidateQueries(['currentAssessor', assessorId])
            successNotification('Ассесор успешно уволен')
            close(false)
            navigate(-1)
        }, onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])
        }
    })
    const [options, setOptions] = useState<any[]>([])
    const [selectedReason, setSelectedReason] = useState<number>()
    const [isOpenCalendar, setIsOpenCalendar] = useState(false)
    const checkBlackList = (value: string | number | undefined) => {
        return reasons.data?.results.find(reason => reason.id.toString() === value?.toString())?.blacklist_reason
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
            <div className='w-full h-[200px]'>
                <h1 className='px-4 border-b border-black mb-2'>Увольнение</h1>
                <Select
                    options={options}
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