import {Dispatch, useState} from "react";
import {useFetchReason} from "./queries";


export const useReason = ({setIsOpenCalendar}: {
    setIsOpenCalendar: Dispatch<boolean>
}) => {
    const reasons = useFetchReason()
    const checkBlackList = (value: string) => {
        return reasons.data?.results.find(reason => reason.id.toString() === value.toString())?.blacklist_reason
    }
    const reasonList = reasons.data ? reasons.data.results.map(reason => {
            return {label: reason.title, value: reason.id}
        }) : []
    
    const [selectedReason, setSelectedReason] = useState<string>('')
    const onChangeReason = (newValue: any) => {
        setSelectedReason(newValue.value)
        if (!checkBlackList(newValue.value)) {
            setIsOpenCalendar(true)
        } else {
            setIsOpenCalendar(false)
        }
    }
    const getValueReason = () => {
        return selectedReason ? reasonList.find(reason => reason.value.toString() === selectedReason.toString()) : ''
    }

    return {reasonList,selectedReason, onChangeReason, getValueReason, checkBlackList}
}

export const useCalendar = () => {
    const [calendarValue, setCalendarValue] = useState({
        startDate: null,
        endDate: null
    });
    const handleValueCalendarChange = (newValue: any) => {
        setCalendarValue(newValue);
    }
    return {calendarValue, handleValueCalendarChange}
}