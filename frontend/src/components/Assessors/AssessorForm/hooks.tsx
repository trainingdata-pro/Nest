import {useContext, useState} from "react";
import {Context} from "../../../index";
import {useQuery} from "react-query";
import ManagerService from "../../../services/ManagerService";


export const useAssessorStatus = ({setValue}: {
    setValue: any
}) => {
    const statusObject = [
        {value: "full", label: "Полная загрузка"},
        {value: "partial", label: "Частичная загрузка"},
        {value: "reserved", label: "Зарезервирован"},
    ]
    const [currentStatus, setCurrentStatus] = useState<string>()

    const handlerChangeStatus = (newValue: any) => {
        setCurrentStatus(newValue.value)
        setValue('status', newValue.value)
    }
    const handlerValueStatus = () => {
        return currentStatus ? statusObject.find(s => s.value === currentStatus) : ''
    }

    return {statusObject, handlerChangeStatus, handlerValueStatus}
}


export const useAssessorCountry = ({setValue}: {
    setValue: any
}) => {
    const countryObject = [
        {label: "РФ", value: "РФ"},
        {label: "РБ", value: "РБ"},
        {label: "ПМР", value: "ПМР"},
        {label: "Другое", value: "Другое"},
    ]
    const [currentCountry, setCurrentCountry] = useState<string>('')

    const handlerChangeCountry = (newValue: any) => {
        setCurrentCountry(newValue.value)
        setValue('country', newValue.value)
    }
    const handlerValueCountry = () => {
        return currentCountry ? countryObject.find(c => c.value === currentCountry) : ''
    }

    return {countryObject, handlerChangeCountry, handlerValueCountry}
}

export const useAssessorProject = ({setValue, availableProjects}: {
    setValue: any,
    availableProjects: {value:string | number, label: string}[]
}) => {
    const [selectedProjects, setSelectedProjects] = useState<number>()

    const handlerValueProjects = () => {
        return selectedProjects ? availableProjects.find(p => p.value === selectedProjects) : ''
    }
    const handlerChangeProjects = (newValue: any) => {
        setSelectedProjects(newValue.value)
        setValue('projects', newValue.value)

    }

    return {handlerValueProjects, handlerChangeProjects}
}


export const useAssessorManager = ({setValue}: {setValue:any}) => {
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
        setSelectedManagers(newValue.value)
        setValue('manager', newValue.value)
    }
    const getManager = () => {
        if (selectedManagers) {
            return fetchTeam.data?.find((manager: any) => selectedManagers.toString() === manager.value.toString())
        } else {
            return []
        }
    }

    return {onManagerChange, getManager, fetchTeam, setSelectedManagers}
}