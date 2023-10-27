import React, {useContext, useState} from 'react';
import {useMyAssessorsSorting} from "../columns";
import {useQuery} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {Context} from "../../../../index";
import {getCoreRowModel, useReactTable} from "@tanstack/react-table";
import MyTable from "../../../UI/Table";
import TablePagination from "../../../UI/TablePagination";
import Loader from "../../../UI/Loader";
import AssessorsManagement from "../../AssessorsManagement/AssessorsManagement";

const PersonalAssessors = () => {
    const {columns, selectedRows, setSelectedRows} = useMyAssessorsSorting()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const assessors = useQuery(['assessors', currentPage], () => AssessorService.fetchManagersAssessors(currentPage, store.user_id), {
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / 10))
        }
    })
    const {store} = useContext(Context)
    const table = useReactTable({
        data: assessors.isSuccess ? assessors.data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: false,
    })
    if (assessors.isLoading) return <Loader width={30}/>
    return (
        <><div className='flex justify-end'>
            <AssessorsManagement type={'personal'}
                                 availablePopup={selectedRows.length !== 0}
                                 setSelectedRow={setSelectedRows}
                                 selectedRows={selectedRows}
            />
        </div>
        <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
            <MyTable table={table}/>
            <TablePagination
                totalRows={totalRows}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}/>
        </div>
        </>
    );
};

export default PersonalAssessors;