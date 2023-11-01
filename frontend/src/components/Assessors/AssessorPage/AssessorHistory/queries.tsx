import {useState} from "react";
import {useQuery} from "react-query";
import AssessorService from "../../../../services/AssessorService";


export const useAssessorHistory = ({assessorId}: {
    assessorId: number | string | undefined
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const history = useQuery(['fullAssessorHistory', assessorId, currentPage], () => AssessorService.fetchHistoryByAssessor(assessorId, currentPage), {
        enabled: !!assessorId,
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / 10))
        }
    })
    return {currentPage, setCurrentPage, totalPages, totalRows, history}
}