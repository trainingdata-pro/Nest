import React, {useState} from 'react';
import Header from "../../Header/Header";
import {
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import Table from "../../UI/Table";
import MyButton from "../../UI/MyButton";
import {observer} from "mobx-react-lite";
import Dialog from "../../UI/Dialog";
import Export from "../Export";
import {useCompletedProjectsColumns} from "./columns";
import TablePagination from "../../UI/TablePagination";
import Loader from "../../UI/Loader";
import {useCompletedProjects} from "./queries";
import ProjectForm from "../ProjectForm/ProjectForm";

const CompletedProjects = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [projectId, setProjectId] = useState(0)
    const {sorting, getSortingString, columns} = useCompletedProjectsColumns({setProjectId,setShowSidebar})
    const {currentPage, setCurrentPage, totalPages, totalRows, completedProjects} = useCompletedProjects({sorting, getSortingString})

    const table = useReactTable({
        data: completedProjects.isSuccess ? completedProjects.data.results : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableSorting: false
    })

    const [isExportProjects, setIsExportProjects] = useState(false)
    if (completedProjects.isLoading) return <Loader width={30}/>
    return (
        <div>
            <Header/>
            <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                <ProjectForm projectId={projectId}
                             closeSidebar={setShowSidebar}/>
            </Dialog>
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