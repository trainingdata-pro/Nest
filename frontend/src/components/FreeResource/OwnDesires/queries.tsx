import {useState} from "react";
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";


export const useFetchOwnDesires = ({sorting, globalFilter, skillsFilter, sortingString}: {
    sorting: any,
    globalFilter:  string,
    skillsFilter: string,
    sortingString: string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)

    const fired = useQuery(['fired', currentPage, sorting, globalFilter,skillsFilter, pageLimit], () => AssessorService.fetchFired(currentPage, sortingString, globalFilter,skillsFilter, pageLimit), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })
    return {fired, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit}
}