import {Dispatch, useState} from "react";
import {useFetchReason} from "./queries";


export const useReason = ({setIsOpenCalendar}: {
    setIsOpenCalendar: Dispatch<boolean>
}) => {
    const reasons = useFetchReason()
    const checkBlackList = (value: string) => {
        return reasons.data?.results.find(reason => reason.id.toString() === value.toString())?.blacklist_reason
    }
    const [options, setOptions] = useState<any[]>([reasons.data?.results.map(reason => {return {label: reason.title, value: reason.id}})])
    const [selectedReason, setSelectedReason] = useState<number>()
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

    return {options,selectedReason, onChangeReason, getValueReason}
}