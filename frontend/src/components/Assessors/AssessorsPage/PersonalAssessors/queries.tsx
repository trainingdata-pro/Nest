import {useQuery} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {useState} from "react";


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
    const [pageLimit, setPageLimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const assessors = useQuery(['assessors', currentPage, sorting, skillsFilter, pageLimit], () => AssessorService.fetchManagersAssessors(currentPage, sortingString, skillsFilter.join(','), pageLimit), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })
    return {assessors, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit}
}