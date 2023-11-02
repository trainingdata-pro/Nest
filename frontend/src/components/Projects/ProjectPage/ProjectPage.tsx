import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import ProjectService from "../../../services/ProjectService";
import Dialog from "../../UI/Dialog";
import AddAssessorForm from "../../Assessors/AddAssessorForm";
import Header from '../../Header/Header';
import {useQuery} from "react-query";
import ProjectMenu from "./ProjectMenu";
import DeleteFromProjects from "../../AssessorManagement/DeleteFromProjects/DeleteFromProjects";
import AddToProject from "./AddToProject";
import MyButton from "../../UI/MyButton";
import Export from "../Export";
import TablePagination from "../../UI/TablePagination";
import {useProjectAssessorsColumns} from "./columns";
import ProjectManagement from "./ProjectManagement";
import NewTable from "../../UI/NewTable";
import Page404 from "../../../pages/Page404";
import Loader from "../../UI/Loader";
import {useFetchProjectAssessors} from "./queries";


const ProjectPage = () => {
        const {id} = useParams()
        const navigate = useNavigate()
        const {columns, sorting, selectedRows, getSortingString, setSelectedRows} = useProjectAssessorsColumns()

        const projectInfo = useQuery(['projectName'], () => ProjectService.fetchProject(id), {
            retry: false,
        })
        const {
            projectAssessors,
            currentPage,
            setCurrentPage,
            totalPages,
            totalRows,
        } = useFetchProjectAssessors({enabled: projectInfo.isSuccess, projectId: id})

        const [addToProject, setAddToProject] = useState(false)
        const [addAssessor, setAddAssessor] = useState(false)
        const [idDeleteFromProject, setIsDeleteFromProject] = useState(false)
        const [isExportAssessors, setIsExportAssessors] = useState(false)

        if (projectInfo.isLoading || projectAssessors.isLoading) return <Loader/>
        if (projectInfo.isError || projectAssessors.isError) return <Page404/>

        return (
            <div>
                <Dialog isOpen={addToProject} setIsOpen={setAddToProject}>
                    <AddToProject setAddToProject={setAddToProject}/>
                </Dialog>
                <Dialog isOpen={addAssessor} setIsOpen={setAddAssessor}>
                    <AddAssessorForm assessorId={projectInfo.data?.id} project={projectInfo.data}
                                     setShowSidebar={setAddAssessor}/>
                </Dialog>
                <Dialog isOpen={idDeleteFromProject} setIsOpen={setIsDeleteFromProject}>
                    {id && <DeleteFromProjects projectId={id} assessorsProjects={selectedRows}
                                               close={setIsDeleteFromProject}/>}
                </Dialog>
                <Dialog isOpen={isExportAssessors} setIsOpen={setIsExportAssessors}>
                    <Export setIsExportProjects={setIsExportAssessors} exportType='projectAssessors' project={id}/>
                </Dialog>
                <Header/>
                <div className="flex-col mx-auto pt-[70px] pr-8 pl-8 items-center">
                    <div className="flex justify-between my-2">
                        <div className="flex items-center">
                            <div className="pl-[15px]">Проект: {projectInfo.data?.name}</div>
                        </div>
                        <div className='flex space-x-2'>
                            <ProjectManagement project={id} status={projectInfo.data?.status}/>
                            <ProjectMenu setIsDeleteFromProject={setIsDeleteFromProject}
                                         isSelected={selectedRows.length !== 0}/>
                            <MyButton onClick={() => setAddToProject(true)}>Добавить на проект</MyButton>
                            <MyButton onClick={() => setAddAssessor(true)}>Добавить ассессора</MyButton>
                            <MyButton onClick={() => setIsExportAssessors(true)}>Экспорт данных</MyButton>
                        </div>
                    </div>
                    <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                        <NewTable data={projectAssessors.isSuccess ? projectAssessors.data.results : []} columns={columns}/>
                        <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                                         setCurrentPage={setCurrentPage}/>
                    </div>
                </div>

            </div>
        );
    }
;

export default ProjectPage;