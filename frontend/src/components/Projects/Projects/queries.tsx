import {useState} from "react";
import {useQuery} from "react-query";
import ProjectService from "../../../services/ProjectService";


export const useFetchProjects = ({sorting, sortingString}:{
    sorting: any,
    sortingString: string
}) => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState<number>(10)

    const projects = useQuery(['projects', sorting, currentPage, pageLimit], () => ProjectService.fetchProjects(currentPage, sortingString, pageLimit), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })

    return {projects, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit}
}