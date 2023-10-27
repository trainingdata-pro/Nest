import React, {useEffect, useState} from 'react';
import Header from "../../Header/Header";
import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Project} from "../../../models/ProjectResponse";
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import ProjectService from "../../../services/ProjectService";
import Loader from "../../UI/Loader";
import Dialog from "../../UI/Dialog";
import ProjectForm from "../ProjectForm";
import MyButton from "../../UI/MyButton";
import Table from "../../UI/Table";
import {useProjectsSorting} from "./columns";
import TablePagination from "../../UI/TablePagination";

const MainPage = () => {
    const {getSortingString,projectsId, sorting, setShowSidebar, setProjectId, columns, showSidebar} = useProjectsSorting()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const {
        data,
        isLoading,
        isSuccess
    } = useQuery(['projects', sorting], () => ProjectService.fetchProjects(currentPage, getSortingString()), {
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
        enableSorting:false,
    })
    if (isLoading) {
        return <Loader width={"16"}/>
    }

    return (
        <div>
            <Header/>
            <div className="pt-20 items-center pb-6">
                <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                    <ProjectForm projectId={projectsId}
                                 closeSidebar={setShowSidebar}/>
                </Dialog>
                <div className="h-full w-full px-8">

                    <div className="flex-col items-center">
                        <div className="flex justify-between my-2">
                            <div className='my-auto'>
                                <p>Всего активных проектов: {data?.results.length}</p>
                            </div>
                            <MyButton onClick={() => {
                                setProjectId(0)
                                setShowSidebar(true)
                            }}>Добавить проект
                            </MyButton>
                        </div>
                        <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                        <Table table={table}/>
                        <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
                        </div></div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;