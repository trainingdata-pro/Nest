import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import Dialog from "../../UI/Dialog";
import AddAssessorForm from "../../Assessors/AssessorForm/AddAssessorForm";
import Header from '../../Header/Header';
import ProjectMenu from "./ProjectMenu";
import DeleteFromProjects from "../../AssessorManagement/DeleteFromProjects/DeleteFromProjects";
import AddToProject from "./AddToProject";
import MyButton from "../../UI/MyButton";
import Export from "../Export";
import {useProjectAssessorsColumns} from "./columns";
import ProjectManagement from "./ProjectManagement";
import Table from "../../UI/Table";
import Page404 from "../../../views/Page404";
import Loader from "../../UI/Loader";
import {useFetchProjectAssessors, useFetchProjectInfo} from "./queries";
import Select from "react-select";
import {useSkillsFilter, useStatusFilter} from "./hooks";
import Confirm from "../../UI/Confirm";


const ProjectPage = () => {
        const {id} = useParams()
        const {columns, sorting, selectedRows, getSortingString} = useProjectAssessorsColumns()
        const {projectInfo} = useFetchProjectInfo({projectId: id})
        const {skills, onSkillsChange, getValueSkills, skillsFilter} = useSkillsFilter()
        const {statusList, selectedStatus, handlerSelectChangeStatus, getStatusValue} = useStatusFilter()
        const {
            projectAssessors,
            currentPage,
            setCurrentPage,
            totalPages,
            totalRows,
            pageLimit,
            setPageLimit
        } = useFetchProjectAssessors({
            enabled: projectInfo.isSuccess,
            projectId: id,
            sorting: sorting,
            sortingString: getSortingString(),
            skillsFilter: skillsFilter.join(','),
            statusFilter: selectedStatus.join(',')
        })
        const [isOpenConfirm, setIsOpenConfirm] = useState(false)
        const closeDialog = () => {
            setIsOpenConfirm(true)
        }
        const confirmAction = () => {

        }

        const [addToProject, setAddToProject] = useState(false)
        const [addAssessor, setAddAssessor] = useState(false)
        const [idDeleteFromProject, setIsDeleteFromProject] = useState(false)
        const [isExportAssessors, setIsExportAssessors] = useState(false)


        if (projectInfo.isFetching) return <Loader/>
        if (projectInfo.isError || projectAssessors.isError) return <Page404/>

        return (
            <div>
                <Dialog isOpen={isOpenConfirm} setIsOpen={confirmAction} topLayer={true}>
                    <Confirm isCloseConfirm={setIsOpenConfirm} isCloseModal={setAddAssessor}/>
                </Dialog>
                <Dialog isOpen={addToProject} setIsOpen={setAddToProject}>
                    <AddToProject setAddToProject={setAddToProject}/>
                </Dialog>
                <Dialog isOpen={addAssessor} setIsOpen={setAddAssessor}>
                    <AddAssessorForm project={projectInfo.data} setShowSidebar={closeDialog} isOpenModal={setAddAssessor}/>
                </Dialog>
                <Dialog isOpen={idDeleteFromProject} setIsOpen={setIsDeleteFromProject}>
                    {id && <DeleteFromProjects projectId={id} assessorsProjects={selectedRows}
                                               close={setIsDeleteFromProject}/>}
                </Dialog>
                <Dialog isOpen={isExportAssessors} setIsOpen={setIsExportAssessors}>
                    <Export setIsExportProjects={setIsExportAssessors} exportType='projectAssessors' project={id}/>
                </Dialog>
                <div className="flex-col mx-auto items-center">
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
                    <div className='flex space-x-2'>
                        <div className='flex-[16%] flex-col space-y-2'>
                            <Select
                                placeholder='Фильтр по навыкам'
                                options={skills.data ? skills.data : []}
                                isMulti
                                value={getValueSkills()}
                                isSearchable={false}
                                onChange={onSkillsChange}
                            />
                            <Select
                                placeholder='Фильтр по статусу'
                                options={statusList}
                                isMulti
                                isSearchable={false}
                                value={getStatusValue()}
                                onChange={handlerSelectChangeStatus}
                            />
                        </div>
                        <div className='flex-[84%] rounded-[20px] bg-white'>
                            {projectAssessors.isFetching ? <Loader height={'h-[calc(100vh-150px)]'}/> :
                                <Table data={projectAssessors.isSuccess ? projectAssessors.data.results : []}
                                       columns={columns} totalRows={totalRows} currentPage={currentPage}
                                       totalPages={totalPages}
                                       setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit}
                                       pages={true}/>}
                        </div>
                    </div>

                </div>

            </div>
        );
    }
;

export default ProjectPage;