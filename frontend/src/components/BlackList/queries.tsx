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
    const blacklist = useQuery(['blacklist', currentPage, globalFilter,sorting], () => AssessorService.getBlackList(currentPage, globalFilter, sortingString), {
        keepPreviousData: true,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / 10))
        }
    })

    return {blacklist, currentPage, setCurrentPage, totalPages, totalRows}
}