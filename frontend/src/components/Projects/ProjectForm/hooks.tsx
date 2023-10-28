import {useQuery} from "react-query";
import ProjectService from "../../../services/ProjectService";
import {useContext, useState} from "react";
import ManagerService from "../../../services/ManagerService";
import {Context} from "../../../index";


export const useTags = ({setValue}: {setValue:any}) => {
    const tagsQuery = useQuery(['tags'], () => ProjectService.fetchProjectTags(), {
        select: data => {
            return data.results.map(tag => {
                return {label: tag.name, value: tag.id}
            })
        }
    })
    const [currentTags, setCurrentTags] = useState<number[]>([])
    const onTagChange = (newValue: any) => {
        const tagsId = newValue.map((value: any) => value.value)
        setCurrentTags(tagsId)
        setValue('tag', tagsId)
    }
    const getValueTag = () => {
        if (currentTags) {
            return tagsQuery.data?.filter((tag: any) => currentTags.indexOf(tag.value) >= 0)
        } else {
            return []
        }
    }
    return {tagsQuery, onTagChange, getValueTag, setCurrentTags}
}

export const useTeam = ({setValue}: {setValue:any}) => {
    const {store} = useContext(Context)
    const fetchTeam = useQuery('managers', () => ManagerService.fetchTeamLeadTeam(store.user_id),{
        enabled: store.user_data.is_teamlead,
        select: data => {
            return [...data.results.map(manager => {
                return {value: manager.user.id, label: `${manager.user.last_name} ${manager.user.first_name}`}
            })]
        }}
    )
    const [selectedManagers, setSelectedManagers] = useState<any>([])
    const onManagerChange = (newValue: any) => {
        const managersId = newValue.map((value: any) => value.value)
        setSelectedManagers(managersId)
        setValue('manager', managersId)
    }
    const getManager = () => {
        if (selectedManagers) {
            return fetchTeam.data?.filter((manager: any) => selectedManagers.indexOf(manager.value) >= 0)
        } else {
            return []
        }
    }

    return {onManagerChange, getManager, fetchTeam, setSelectedManagers}
}

export const useRegularity = ({setValue}: {setValue:any}) => {
    const [regOptions, setRegOptions] = useState([
        {label: 'Разовая', value: 'Разовая'},
        {label: 'Будние дни', value: 'Будние дни'},
        {label: 'Ежедневно', value: 'Ежедневно'},
        {label: 'Раз в неделю', value: 'Раз в неделю'},
        {label: 'Раз в две недели', value: 'Раз в две недели'},
        {label: 'Раз в месяц', value: 'Раз в месяц'}
    ])
    const [regularity, setRegularity] = useState('')
    const onChangeRegularity = (newValue: any) => {
        setRegularity(newValue.value)
        setValue('unloading_regularity', newValue.value)
    }
    const getRegularity = () => {
        return regularity ? regOptions.find(s => s.value === regularity): ''
    }

    return {regOptions, onChangeRegularity, getRegularity, setRegularity, setRegOptions}
}

export const useStatus = ({setValue}: {setValue:any}) => {
    const statusList = [
        {value: 'active', label: 'Активный'},
        {value: 'pause', label: 'На паузе'},
        {value: 'completed', label: 'Завершен'}
    ]
    const [currentStatus, setCurrentStatus] = useState<string>()
    const getValueStatus = () => {
        return currentStatus ? statusList.find(s => s.value === currentStatus) : ''
    }
    const onChangeStatus = (newValue: any) => {
        setCurrentStatus(newValue.value)
        setValue('status', newValue.value)
    }
    return {statusList, getValueStatus, onChangeStatus, setCurrentStatus}
}