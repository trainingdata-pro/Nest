import React, {useState} from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";

import {
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import {IFreeResources} from "../../../models/AssessorResponse";
import Table from "../../UI/Table";
import Loader from "../../UI/Loader";
import {observer} from "mobx-react-lite";
import TablePagination from "../../UI/TablePagination";
import {useFreeResourcesSorting} from "./columns";

export interface FreeAssessor extends IFreeResources {
    last_manager: string,
    last_project: string
}

const FreeResource = ({globalFilter, skillsFilter}: {
    globalFilter: string,
    skillsFilter: string
}) => {
    const {columns, sorting, getSortingString} = useFreeResourcesSorting()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const {
        data,
        isLoading
    } = useQuery(['freeResources', currentPage, sorting, globalFilter,skillsFilter], () => AssessorService.fetchFreeResource(currentPage, getSortingString(), globalFilter, skillsFilter), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / 10))
        }
    })
    const table = useReactTable({
        data: data ? data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    if (isLoading) return <Loader width={40}/>
    return (
        <div>
            <Table table={table}/>
            <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                             setCurrentPage={setCurrentPage}/>
        </div>
    );
};

export default observer(FreeResource);