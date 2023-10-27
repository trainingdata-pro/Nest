import React, {useState} from 'react';
import Header from "../components/Header/Header";
import ProjectService from "../services/ProjectService";
import {useQuery} from "react-query";
import {
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import Table from "../components/UI/Table";
import MyButton from "../components/UI/MyButton";
import {observer} from "mobx-react-lite";
import Dialog from "../components/UI/Dialog";
import Export from "../components/Projects/Export";
import {useCompletedProjectsColumns} from "../components/Projects/CompletedProjects/columns";
import TablePagination from "../components/UI/TablePagination";
import Loader from "../components/UI/Loader";

const CompletedProjects = () => {
    const {sorting, getSortingString, columns} = useCompletedProjectsColumns()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const {
        data,
        isSuccess,
        isLoading
    } = useQuery(['completedProjects', currentPage, sorting], () => ProjectService.fetchCompletedProjects(currentPage, getSortingString()), {
        keepPreviousData: true,
        onSuccess: data => {
            setTotalRows(data.count)
            setTotalPages(Math.ceil(data.count / 10))
        }
    })

    const table = useReactTable({
        data: isSuccess ? data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableSorting: false
    })
    const [isExportProjects, setIsExportProjects] = useState(false)
    if (isLoading) return <Loader width={30}/>
    return (
        <div>
            <Header/>
            <Dialog isOpen={isExportProjects} setIsOpen={setIsExportProjects}>
                <Export setIsExportProjects={setIsExportProjects} exportType='completedProjects' project={undefined}/>
            </Dialog>
            <div className="pt-20 px-8">
                <div className='my-2 flex justify-end'>
                    <MyButton onClick={() => setIsExportProjects(true)}>Экспорт</MyButton>
                </div>
                <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>

                    <Table table={table}/>
                    <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                                     setCurrentPage={setCurrentPage}/>
                </div>
            </div>
        </div>
    );
};

export default observer(CompletedProjects);