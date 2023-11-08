import {useState} from "react";
import {useQuery} from "react-query";
import ProjectService from "../../../services/ProjectService";


export const useCompletedProjects = ({sorting, getSortingString}: {
    sorting: any,
    getSortingString: () => string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)

    const completedProjects = useQuery(['completedProjects', currentPage, sorting, pageLimit], () => ProjectService.fetchCompletedProjects(currentPage, getSortingString(), pageLimit), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })
    return {currentPage, setCurrentPage, totalPages, totalRows, completedProjects, pageLimit, setPageLimit}
}