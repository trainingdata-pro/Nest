
import {useQuery} from "react-query";
import ProjectService from "../../../services/ProjectService";
import {usePagination} from "../../../utils/pagination";


export const useCompletedProjects = ({sorting, getSortingString}: {
    sorting: any,
    getSortingString: () => string
}) => {
    const {currentPage, setCurrentPage, totalPages, setTotalPages, totalRows, setTotalRows, pageLimit, setPageLimit} = usePagination()
    const completedProjects = useQuery(['completedProjects', currentPage, sorting, pageLimit], () => ProjectService.fetchCompletedProjects(currentPage, getSortingString(), pageLimit), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })
    return {currentPage, setCurrentPage, totalPages, totalRows, completedProjects, pageLimit, setPageLimit}
}