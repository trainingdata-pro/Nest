import React, {useState} from 'react';
import AssessorService from "../../../../services/AssessorService";
import {useQuery} from "react-query";
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
import {IHistory} from "../../../../models/AssessorResponse";
import Table from "../../../UI/Table";
import TablePagination from "../../../UI/TablePagination";
import {useHistoryColumns} from "./columns";
import NewTable from "../../../UI/NewTable";
import {useAssessorHistory} from "./queries";



const AssessorHistory = ({assessorId}: {
    assessorId: number | string | undefined
}) => {

    const {currentPage, setCurrentPage, totalPages, totalRows, history} = useAssessorHistory({assessorId:assessorId})
    const {columns} = useHistoryColumns()

    return (
        <>
            <div className='border-b border-black w-full'>
                <h1 className='px-4 py-2'>История</h1>
            </div>
            <div className='px-2 mt-2'>
                <NewTable data={history.isSuccess ? history.data.results : []} columns={columns}/>
                <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                                 setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
};

export default AssessorHistory;