import {useState} from "react";
import {useQuery} from "react-query";
import AssessorService from "../../services/AssessorService";


export const useCheckAssessor = ({name}: {
    name: string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const checkAssessors = useQuery(['checkAssessor', currentPage, name], () => AssessorService.checkAssessor(currentPage, name), {
        enabled: name.length >= 3,
        keepPreviousData:true,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / 10))
        }
    })

    return {setCurrentPage,currentPage, totalPages, totalRows, checkAssessors}
}