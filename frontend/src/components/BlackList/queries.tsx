import {useState} from "react";
import {useQuery} from "react-query";
import AssessorService from "../../services/AssessorService";



export const useFetchBlacklist = ({globalFilter, sorting, sortingString}: {
    globalFilter: string,
    sorting: any,
    sortingString: string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)
    const blacklist = useQuery(['blacklist', currentPage, globalFilter,sorting, pageLimit], () => AssessorService.getBlackList(currentPage, globalFilter, sortingString, pageLimit), {
        keepPreviousData: true,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / pageLimit))
        }
    })

    return {blacklist, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit}
}