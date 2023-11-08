import {useState} from "react";
import {useQuery} from "react-query";
import ProjectService from "../../../../services/ProjectService";


export const useFetchProjectsToDelete = ({assessorsIds}:{
    assessorsIds: string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)
    const projects = useQuery(['removeProjects', currentPage, pageLimit], () => ProjectService.fetchProjectsForDelete(currentPage,'', pageLimit, assessorsIds), {
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })
    return {projects, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit}
}