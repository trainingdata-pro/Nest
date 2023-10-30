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
    const completedProjects = useQuery(['completedProjects', currentPage, sorting], () => ProjectService.fetchCompletedProjects(currentPage, getSortingString()), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / 10))
        }
    })
    return {currentPage, setCurrentPage, totalPages, totalRows, completedProjects}
}