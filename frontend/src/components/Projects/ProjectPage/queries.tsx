import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import {useState} from "react";


export const useFetchProjectAssessors = ({enabled, projectId}: {
    enabled: boolean,
    projectId: number | string | undefined
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const projectAssessors = useQuery(['projectAssessors', currentPage, projectId], () => AssessorService.fetchAssessors(currentPage, projectId), {
        enabled: enabled,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / 10))

        },
    })

    return {projectAssessors, currentPage, setCurrentPage, totalPages, totalRows}
}