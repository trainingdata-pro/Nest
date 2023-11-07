import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import Dialog from "../../UI/Dialog";
import AddAssessorForm from "../../Assessors/AssessorForm/AddAssessorForm";
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
import {useFetchProjectAssessors, useFetchProjectInfo} from "./queries";
import AssessorService from "../../../services/AssessorService";
import Select from "react-select";


const ProjectPage = () => {
        const {id} = useParams()
        const {columns, sorting, selectedRows, getSortingString} = useProjectAssessorsColumns()
        const [skillsFilter, setSkillsFilter] = useState<number[]>([])
        const [selectedStatus, setSelectedStatus] = useState<string[]>([])
        const {projectInfo} = useFetchProjectInfo({projectId: id})
        const {
            projectAssessors,
            currentPage,
            setCurrentPage,
            totalPages,
            totalRows,
        } = useFetchProjectAssessors({
            enabled: projectInfo.isSuccess,
            projectId: id,
            sorting: sorting,
            sortingString: getSortingString(),
            skillsFilter: skillsFilter,
            statusFilter: selectedStatus.join(',')
        })
        const status = [
            {value: 'full', label: 'Полная загрузка'},
            {value: 'partial', label: 'Частичная загрузка'},
            {value: 'reserved', label: 'Зарезервирован'}
        ]
        const handleSelectChangeStatus = (value: any) => {
            setSelectedStatus(value.map((val:any) => val.value))
        };

        const getStatusValue = () => {
            return selectedStatus ? status.filter(status => selectedStatus.find(stat => status.value === stat) !== undefined) : []
        }
        const [addToProject, setAddToProject] = useState(false)
        const [addAssessor, setAddAssessor] = useState(false)
        const [idDeleteFromProject, setIsDeleteFromProject] = useState(false)
        const [isExportAssessors, setIsExportAssessors] = useState(false)
        useQuery(['skills'], () => AssessorService.fetchSkills(), {
            onSuccess: data => {
                setSkillsList(data.results.map(tag => {
                    return {label: tag.title, value: tag.id}
                }))
            }
        })
        const [skillsList, setSkillsList] = useState<any>([])
        const onSkillsChange = (newValue: any) => {
            const tagsId = newValue.map((value: any) => value.value)
            setSkillsFilter(tagsId)
        }
        const getValueSkills = () => {
            if (skillsFilter) {
                return skillsList.filter((tag: any) => skillsFilter.indexOf(tag.value) >= 0)
            } else {
                return []
            }
        }
        if (projectInfo.isLoading) return <Loader/>
        if (projectInfo.isError || projectAssessors.isError) return <Page404/>

        return (
            <div>
                <Dialog isOpen={addToProject} setIsOpen={setAddToProject}>
                    <AddToProject setAddToProject={setAddToProject}/>
                </Dialog>
                <Dialog isOpen={addAssessor} setIsOpen={setAddAssessor}>
                    <AddAssessorForm project={projectInfo.data} setShowSidebar={setAddAssessor}/>
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
                    <div className='flex space-x-2'>
                        <div className='flex-[16%] flex-col space-y-2'>
                            <div className="">
                                <Select
                                    placeholder='Фильтр по навыкам'
                                    options={skillsList}
                                    isMulti
                                    value={getValueSkills()}
                                    isSearchable={false}
                                    onChange={onSkillsChange}
                                />
                            </div>
                            <div>
                                <Select
                                    placeholder='Фильтр по статусу'
                                    options={status}
                                    isMulti
                                    isSearchable={false}
                                    value={getStatusValue()}
                                    onChange={handleSelectChangeStatus}
                                />
                            </div>
                        </div>
                        <div className='flex-[84%] rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                            <NewTable data={projectAssessors.isSuccess ? projectAssessors.data.results : []}
                                      columns={columns}/>
                            <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                                             setCurrentPage={setCurrentPage}/>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
;

export default ProjectPage;