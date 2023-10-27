import React, {useState} from 'react';
import {errorNotification} from "../../UI/Notify";
import Table from "../../UI/Table";
import {getCoreRowModel, getPaginationRowModel, RowSelectionState, useReactTable} from "@tanstack/react-table";
import MyButton from "../../UI/MyButton";
import {useGetProjects, useRentAssessor} from "./queries";
import {useRentAssessorColumns} from "./columns";
import {useQuery} from "react-query";
import ProjectService from "../../../services/ProjectService";
import TablePagination from "../../UI/TablePagination";


const RentAssessor = ({assessorId, show}:{
    assessorId: string | number,
    show: React.Dispatch<boolean>
}) => {
    const {selectedRows, columns} = useRentAssessorColumns()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const {data, isSuccess} = useQuery(['projects'], () => ProjectService.fetchProjects(currentPage, ''), {
        keepPreviousData: true,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / 10))
        }
    })
    const table = useReactTable({
        data: isSuccess ? data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const {mutate} = useRentAssessor({assessorId:assessorId, show:show, project:selectedRows[0]?.original.id})

    const submit = () => {
        if (selectedRows.length !== 0){
            mutate()
        } else {
            errorNotification('Выберите проект')
        }
    }
    return (
        <div>
                <h1 className='px-4 border-b border-black mb-2'>Аренда ассессора</h1>
                <Table table={table}/>
            <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
            <div className='flex justify-between space-x-2'>
                    <MyButton onClick={() => show(false)}>Назад</MyButton>
                    <MyButton onClick={submit}>Сохранить</MyButton>
                </div>
        </div>
    );
};

export default RentAssessor;