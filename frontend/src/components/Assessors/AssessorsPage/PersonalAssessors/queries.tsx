import {useQuery} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {useContext, useState} from "react";
import {Context} from "../../../../index";
import ManagerService from "../../../../services/ManagerService";


export const useFilterSKills = () => {
    const skills = useQuery(['skills'], () => AssessorService.fetchSkills(), {
        select: data => {
            return data.results.map(tag => {
                return {label: tag.title, value: tag.id}
            })
        }
    })
    const [skillsFilter, setSkillsFilter] = useState<number[]>([])

    const onSkillsChange = (newValue: any) => {
        const tagsId = newValue.map((value: any) => value.value)
        setSkillsFilter(tagsId)
    }
    const getValueSkills = () => {
        if (skillsFilter) {
            return skills.data?.filter((tag: any) => skillsFilter.indexOf(tag.value) >= 0)
        } else {
            return []
        }
    }
    return {skills, skillsFilter, onSkillsChange, getValueSkills}
}


export const useFetchAssessors = ({sorting, sortingString, skillsFilter}: {
    sorting: any,
    sortingString: string,
    skillsFilter: number[]
}) => {
    const {store} = useContext(Context)
    const fetchTeamLeadTeam = useQuery(['TeamLeadTeam'], () => ManagerService.fetchTeamLeadTeam(store.user_id), {
        enabled: store.user_data.is_teamlead,
        select: data => {
            return data.results.map(manager => manager.user.id)
        }
    })
    const getManagersIds  = () => {
        if (store.user_data.is_teamlead){
            return fetchTeamLeadTeam.data? fetchTeamLeadTeam.data.join(',') : ''
        } else {
            return store.user_id
        }
    }
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const assessors = useQuery(['assessors', currentPage, sorting, skillsFilter], () => AssessorService.fetchManagersAssessors(currentPage, sortingString, skillsFilter.join(',')), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / 10))
        }
    })
    return {assessors, totalRows, totalPages, setCurrentPage, currentPage}
}