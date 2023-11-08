import {useState} from "react";
import {useQuery} from "react-query";
import AssessorService from "../../../../services/AssessorService";


export const useAssessorHistory = ({assessorId}: {
    assessorId: number | string | undefined
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)
    const history = useQuery(['fullAssessorHistory', assessorId, currentPage, pageLimit], () => AssessorService.fetchHistoryByAssessor(assessorId, currentPage, pageLimit), {
        enabled: !!assessorId,
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })
    return {currentPage, setCurrentPage, totalPages, totalRows, history, pageLimit, setPageLimit}
}