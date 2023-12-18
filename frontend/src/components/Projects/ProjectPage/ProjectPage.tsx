import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import Dialog from "../../UI/Dialog";
import AddAssessorForm from "../../Assessors/AssessorForm/AddAssessorForm";
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
import MyInput from "../../UI/MyInput";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {useDebounce} from "../../../hooks/debounce";
import {useFetchProjectAssessorsQuery} from "../../../services/project";


const ProjectPage = () => {
        const {id} = useParams()
        const {columns, sorting, selectedRows, getSortingString} = useProjectAssessorsColumns()
        const {projectInfo} = useFetchProjectInfo({projectId: id})
        const {skills, onSkillsChange, getValueSkills, skillsFilter} = useSkillsFilter()
        const {statusList, selectedStatus, handlerSelectChangeStatus, getStatusValue} = useStatusFilter()
    const [globalFilter, setGlobalFilter] = React.useState('')
    const {
            currentPage,
            setCurrentPage,
            totalPages,
            totalRows,
            pageLimit,
            setPageLimit
        } = useFetchProjectAssessors()
        const {data, isLoading, isSuccess,isFetching} = useFetchProjectAssessorsQuery({id: Number(id), page: currentPage, page_size: pageLimit, sorting: getSortingString()})
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


        // if (projectInfo.isFetching) return <Loader/>
        // if (projectInfo.isError || projectAssessors.isError) return <Page404/>

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
                            <div className="relative">
                                <MyInput className='border border-gray-400 pl-[8px] py-[6px] pr-[30px]'
                                         placeholder='Поиск по ФИО/Ник в ТГ' value={globalFilter}
                                         onChange={(event) => setGlobalFilter(event.target.value)}/>
                                <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>
                            </div>
                        </div>
                        <div className='flex-[84%] rounded-[20px] bg-white'>
                                <Table data={isSuccess ? data.results : []} isLoading={isFetching}
                                       columns={columns} totalRows={data ? data.count : 0} currentPage={currentPage}
                                       totalPages={isSuccess ? Math.ceil(data.count / pageLimit) : 0}
                                       setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit}
                                />
                        </div>
                    </div>

                </div>

            </div>
        );
    }
;

export default ProjectPage;