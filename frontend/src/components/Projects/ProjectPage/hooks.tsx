import {useFetchSkills} from "./queries";
import {useState} from "react";

export const useSkillsFilter = () => {
    const skills = useFetchSkills()
    const [skillsFilter, setSkillsFilter] = useState<number[]>([])
    const onSkillsChange = (newValue: any) => {
        const tagsId = newValue.map((value: any) => value.value)
        setSkillsFilter(tagsId)
    }
    const getValueSkills = () => {
        if (skillsFilter) {
            return skills.data ? skills.data.filter((tag: any) => skillsFilter.indexOf(tag.value) >= 0) : []
        } else {
            return []
        }
    }

    return {skills, onSkillsChange, getValueSkills, skillsFilter, setSkillsFilter}
}

export const useStatusFilter = () => {
    const statusList = [
        {value: 'full', label: 'Полная загрузка'},
        {value: 'partial', label: 'Частичная загрузка'},
        {value: 'reserved', label: 'Зарезервирован'}
    ]
    const [selectedStatus, setSelectedStatus] = useState<string[]>([])
    const handlerSelectChangeStatus = (value: any) => {
        setSelectedStatus(value.map((val: any) => val.value))
    };

    const getStatusValue = () => {
        return selectedStatus ? statusList.filter(status => selectedStatus.find(stat => status.value === stat) !== undefined) : []
    }

    return {statusList, selectedStatus,setSelectedStatus, handlerSelectChangeStatus, getStatusValue}
}