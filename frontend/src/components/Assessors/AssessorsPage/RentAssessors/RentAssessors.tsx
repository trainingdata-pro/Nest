import React, {useContext, useState} from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {Context} from "../../../../index";
import MyTable from "../../../UI/Table";
import TablePagination from "../../../UI/TablePagination";
import {getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useMyAssessorsSorting} from "../columns";
import Loader from "../../../UI/Loader";
import Dialog from "../../../UI/Dialog";
import AddAssessorForm from "../../AddAssessorForm";
import Header from "../../../Header/Header";
import MyButton from "../../../UI/MyButton";
import AssessorsManagement from "../../AssessorsManagement/AssessorsManagement";
import PersonalAssessors from "../PersonalAssessors/PersonalAssessors";
import {useNavigate} from "react-router-dom";

const RentAssessors = () => {
    const {store} = useContext(Context)
    const {columns, sorting, selectedRows, setSelectedRows, getSortingString} = useMyAssessorsSorting()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const rentAssessors = useQuery(['rentAssessors', currentPage], () => AssessorService.fetchRentAssessors(currentPage, store.user_id))
    const table = useReactTable({
        data: rentAssessors.isSuccess ? rentAssessors.data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: false,
    })
    if (rentAssessors.isLoading) return <Loader width={30}/>
    return (
        <>  <div className='flex justify-end'>
            <AssessorsManagement type={'rent'}
                                 availablePopup={true}
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

export default RentAssessors;