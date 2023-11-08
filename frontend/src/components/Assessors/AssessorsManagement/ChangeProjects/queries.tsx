import {useMutation, useQuery} from "react-query";
import ProjectService from "../../../../services/ProjectService";
import AssessorService from "../../../../services/AssessorService";
import {useState} from "react";

export const useFetchProjects = ({assessorsIds}:{
    assessorsIds: string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)
    const projects = useQuery(['projects', currentPage, pageLimit], () => ProjectService.fetchExcludedProjects(currentPage, '', pageLimit, assessorsIds), {
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })
    return {projects, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit}
}

export const useChangeAssessorProjects = () => {
    return useMutation('assessors', ({id, data}: any) => AssessorService.addAssessorProject(id, data))
}