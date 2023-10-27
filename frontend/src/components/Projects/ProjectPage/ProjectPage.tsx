import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import {
    getCoreRowModel,
    getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
import {ProjectAssessors} from "../../../models/AssessorResponse";
import Table from "../../UI/Table";
import ProjectService from "../../../services/ProjectService";
import Dialog from "../../UI/Dialog";
import AddAssessorForm from "../../Assessors/AddAssessorForm";
import Header from '../../Header/Header';
import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import ProjectMenu from "./ProjectMenu";
import DeleteFromProjects from "../../AssessorManagement/DeleteFromProjects";
import AddToProject from "./AddToProject";
import MyButton from "../../UI/MyButton";
import Export from "../Export";


import TablePagination from "../../UI/TablePagination";
import {useProjectAssessorsColumns} from "./columns";
import ProjectManagement from "./ProjectManagement";


const ProjectPage = () => {
        const {id} = useParams()
        const {columns,sorting, selectedRows, getSortingString, setSelectedRows} = useProjectAssessorsColumns()
        const [currentPage, setCurrentPage] = useState(1)
        const [totalPages, setTotalPages] = useState(1)
        const [totalRows, setTotalRows] = useState<number>(0)
        const {isLoading} = useQuery(['projectAssessors', currentPage, id], () => AssessorService.fetchAssessors(currentPage, id), {
            onSuccess: data1 => {
                setTotalRows(data1.count)
                setTotalPages(Math.ceil(data1.count / 10))
                let newData: ProjectAssessors[] = []
                data1.results.map((assessor: any) => {
                    assessor.working_hours = assessor.working_hours.find((wh: any) => wh.project.id.toString() === id?.toString())
                    assessor.workload_status = assessor.workload_status.find((ws: any) => ws.project.id.toString() === id?.toString())?.status
                    assessor.projects = assessor.projects.map((project: any) => project.id)
                    newData.push({...assessor})
                    return 0
                })
                setTableData(newData)
            }
        })
        const [tableData, setTableData] = useState<ProjectAssessors[]>([])
        const table = useReactTable({
            data: tableData,
            columns,
            getCoreRowModel: getCoreRowModel(),
        })

        const {data} = useQuery(['projectName'], () => ProjectService.fetchProject(id))
        const [addToProject, setAddToProject] = useState(false)
        const [addAssessor, setAddAssessor] = useState(false)
        const [idDeleteFromProject, setIsDeleteFromProject] = useState(false)
        const [isExportAssessors, setIsExportAssessors] = useState(false)

        if (isLoading) return <div>Загрузка</div>
        return (
            <div>
                <Dialog isOpen={addToProject} setIsOpen={setAddToProject}>
                    <AddToProject setAddToProject={setAddToProject}/>
                </Dialog>
                <Dialog isOpen={addAssessor} setIsOpen={setAddAssessor}>
                    <AddAssessorForm assessorId={data?.id} project={data}
                                     setShowSidebar={setAddAssessor}/>
                </Dialog>
                <Dialog isOpen={idDeleteFromProject} setIsOpen={setIsDeleteFromProject}>
                    <DeleteFromProjects projectId={id} assessorsProjects={selectedRows}
                                        close={setIsDeleteFromProject}/>
                </Dialog>
                <Dialog isOpen={isExportAssessors} setIsOpen={setIsExportAssessors}>
                    <Export setIsExportProjects={setIsExportAssessors} exportType='projectAssessors' project={id}/>
                </Dialog>
                <Header/>
                <div className="flex-col mx-auto pt-[70px] pr-8 pl-8 items-center">
                    <div className="flex justify-between my-2">
                        <div className="flex items-center">
                            <div className="pl-[15px]">Проект: {data?.name}</div>
                        </div>
                        <div className='flex space-x-2'>
                            <ProjectManagement project={id} status={data?.status}/>
                            <ProjectMenu setIsDeleteFromProject={setIsDeleteFromProject}
                                         isSelected={selectedRows.length !== 0}/>
                            <MyButton onClick={() => setAddToProject(true)}>Добавить на проект</MyButton>
                            <MyButton onClick={() => setAddAssessor(true)}>Добавить ассессора</MyButton>
                            <MyButton onClick={() => setIsExportAssessors(true)}>Экспорт данных</MyButton>
                        </div>
                    </div>
                    <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                        <Table table={table}/>
                        <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                                         setCurrentPage={setCurrentPage}/>
                    </div>
                </div>

            </div>
        );
    }
;

export default ProjectPage;