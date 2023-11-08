import {useState} from "react";
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";


export const useFetchFreeResources = ({sorting, globalFilter, skillsFilter, sortingString}: {
    sorting: any,
    globalFilter:  string,
    skillsFilter: string,
    sortingString: string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)
    const fetchFreeResources = useQuery(['freeResources', currentPage, sorting, globalFilter,skillsFilter, pageLimit], () => AssessorService.fetchFreeResource(currentPage, sortingString, globalFilter, skillsFilter, pageLimit), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })
    return {fetchFreeResources, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit}
}