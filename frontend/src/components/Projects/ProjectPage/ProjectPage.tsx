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
import ProjectMenu from "../ProjectMenu";
import DeleteFromProjects from "../../AssessorManagement/DeleteFromProjects";
import AddToProject from "../AddToProject";
import MyButton from "../../UI/MyButton";
import Export from "../Export";
import {columns} from './columns'


const ProjectPage = () => {
        const {id} = useParams()
        const {isLoading} = useQuery(['projectAssessors', id], () => fetchAllData(), {
            onSuccess: data1 => {
                let newData: ProjectAssessors[] = []
                data1.map((assessor: any) => {
                    assessor.working_hours = assessor.working_hours.find((wh: any) => wh.project.id.toString() === id?.toString())
                    assessor.workload_status = assessor.workload_status.find((ws: any) => ws.project.id.toString() === id?.toString())?.status
                    assessor.projects = assessor.projects.map((project: any) => project.id)
                    newData.push({...assessor})
                    return 0
                })
                setTableData(newData)
            }
        })
        async function fetchAllData() {
            const allData = [];
            let currentPage = 1;
            let hasMoreData = true;
            while (hasMoreData) {
                const data = await AssessorService.fetchAssessors(currentPage, id);
                allData.push(...data.results);
                if (data.next !== null) {
                    currentPage++;
                } else {
                    hasMoreData = false;
                }
            }
            return allData;
        }

        const [tableData, setTableData] = useState<ProjectAssessors[]>([])
        const [sorting, setSorting] = React.useState<SortingState>([])
        const [rowSelection, setRowSelection] = React.useState({})
        const table = useReactTable({
            data: tableData,
            columns,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            onSortingChange: setSorting,
            getSortedRowModel: getSortedRowModel(),
            enableMultiSort: true,
            maxMultiSortColCount: 2,
            state: {
                rowSelection,
                sorting
            },
            enableRowSelection: true,
            onRowSelectionChange: setRowSelection,
            debugTable: false,
        })
        const getSelectedAssessors = () => {
            return table.getPreFilteredRowModel().rows.filter(row => Object.keys(rowSelection).find(key => key.toString() === row.id.toString()))
        }
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
                    <DeleteFromProjects projectId={id} assessorsProjects={getSelectedAssessors()}
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
                            <ProjectMenu setIsDeleteFromProject={setIsDeleteFromProject}
                                         isSelected={Object.keys(rowSelection).length !== 0}/>
                            <MyButton onClick={() => setAddToProject(true)}>Добавить на проект</MyButton>
                            <MyButton onClick={() => setAddAssessor(true)}>Добавить ассессора</MyButton>
                            <MyButton onClick={() => setIsExportAssessors(true)}>Экспорт данных</MyButton>
                        </div>
                    </div>
                    <Table pages={true} rowSelection={rowSelection} table={table}/>
                </div>

            </div>
        );
    }
;

export default ProjectPage;