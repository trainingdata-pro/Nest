import {useState} from "react";


export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState<number>(10)
    return {currentPage, setCurrentPage, totalPages, setTotalPages, totalRows, setTotalRows, pageLimit, setPageLimit}
}