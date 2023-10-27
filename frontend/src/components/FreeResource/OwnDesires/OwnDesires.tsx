import React, {useState} from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import {
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import Table from "../../UI/Table";
import TablePagination from "../../UI/TablePagination";
import {IFired} from "../../../models/AssessorResponse";
import {useOwnDesiresSorting} from "./columns";

const OwnDesires = ({globalFilter, skillsFilter}: {
    globalFilter: string,
    skillsFilter: string
}) => {
    const {columns, sorting, getSortingString} = useOwnDesiresSorting()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const fired = useQuery(['fired', currentPage, sorting, globalFilter,skillsFilter], () => AssessorService.fetchFired(currentPage, getSortingString(), globalFilter,skillsFilter), {
        keepPreviousData: true,
    })

    const table = useReactTable({
        data: fired.data ? fired.data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })


    return (
        <>
            <Table table={table}/>
            <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                             setCurrentPage={setCurrentPage}/>
        </>
    );
};

export default OwnDesires;