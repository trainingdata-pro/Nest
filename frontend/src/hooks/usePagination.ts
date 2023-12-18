import {useState} from "react";

type Pagination = 'projectPageLimit' | 'completedProjectPage'

export const usePagination = (paginationType: Pagination) => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageLimit, setPageLimit] = useState<number>(sessionStorage.getItem('projectPageLimit') ? Number(sessionStorage.getItem('projectPageLimit')) : 10)
    sessionStorage.setItem(paginationType, String(pageLimit))
    return {currentPage, setCurrentPage, pageLimit, setPageLimit}
}