import {useQuery} from "react-query";
import AssessorService from "../../services/AssessorService";
import {usePagination} from "../../utils/pagination";



export const useFetchBlacklist = ({globalFilter, sorting, sortingString}: {
    globalFilter: string,
    sorting: any,
    sortingString: string
}) => {
    const {currentPage, setCurrentPage, totalPages, setTotalPages, totalRows, setTotalRows, pageLimit, setPageLimit} = usePagination()
    const blacklist = useQuery(['blacklist', currentPage, globalFilter,sorting, pageLimit], () => AssessorService.getBlackList(currentPage, globalFilter, sortingString, pageLimit), {
        keepPreviousData: true,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / pageLimit))
        }
    })

    return {blacklist, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit}
}