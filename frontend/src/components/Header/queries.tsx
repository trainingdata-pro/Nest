import {useState} from "react";
import {useQuery} from "react-query";
import AssessorService from "../../services/AssessorService";


export const useCheckAssessor = ({name}: {
    name: string
}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)

    const checkAssessors = useQuery(['checkAssessor', currentPage, name, pageLimit], () => AssessorService.checkAssessor(currentPage, name, pageLimit), {
        enabled: name.length >= 3,
        keepPreviousData:true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / pageLimit))
        }
    })

    return {setCurrentPage,currentPage, totalPages, totalRows, checkAssessors, pageLimit, setPageLimit}
}