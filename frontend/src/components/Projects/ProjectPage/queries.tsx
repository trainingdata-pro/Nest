import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import {useState} from "react";
import ProjectService from "../../../services/ProjectService";


export const useFetchProjectAssessors = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages] = useState(1)
    const [totalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)
    // const projectAssessors = useQuery(['projectAssessors', currentPage, projectId, sorting,skillsFilter, statusFilter, pageLimit, name], () => AssessorService.fetchAssessors(currentPage, projectId, sortingString,skillsFilter, statusFilter, pageLimit, name), {
    //     enabled: enabled,
    //     onSuccess: data1 => {
    //         setTotalRows(data1.count)
    //         setTotalPages(Math.ceil(data1.count / pageLimit))
    //     },
    // })

    return {currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit}
}

export const useFetchProjectInfo = ({projectId}:{
    projectId: number | string | undefined
}) => {
    const projectInfo = useQuery(['projectInfo', projectId], () => ProjectService.fetchProject(projectId), {
        retry: false,
    })
    return {projectInfo}
}


export const useFetchSkills = () => {
    return useQuery(['skills'], () => AssessorService.fetchSkills(), {
        select: data => {
            return data.results.map(tag => {
                return {label: tag.title, value: tag.id}
            })
        }
    })
}