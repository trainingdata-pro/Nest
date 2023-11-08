import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import {useState} from "react";
import ProjectService from "../../../services/ProjectService";


export const useFetchProjectAssessors = ({enabled, projectId,sorting, sortingString, skillsFilter, statusFilter}: {
    enabled: boolean,
    projectId: number | string | undefined,
    sorting:any,
    sortingString: string,
    skillsFilter: number[],
    statusFilter: string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)
    const projectAssessors = useQuery(['projectAssessors', currentPage, projectId, sorting,skillsFilter, statusFilter, pageLimit], () => AssessorService.fetchAssessors(currentPage, projectId, sortingString,skillsFilter.join(','), statusFilter, pageLimit), {
        enabled: enabled,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / pageLimit))
        },
    })

    return {projectAssessors, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit}
}

export const useFetchProjectInfo = ({projectId}:{
    projectId: number | string | undefined
}) => {
    const projectInfo = useQuery(['projectName', projectId], () => ProjectService.fetchProject(projectId), {
        retry: false,
    })
    return {projectInfo}
}