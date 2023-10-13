import React, {useEffect, useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import {ColumnDef, createColumnHelper} from "@tanstack/react-table";
import {Assessor, WorkingHours} from "../../models/AssessorResponse";
import Table from "../UI/Table";
import ProjectService from "../../services/ProjectService";
import {Project} from "../../models/ProjectResponse";
import Dialog from "../UI/Dialog";
import AddAssessorForm from "../Assessors/AddAssessorForm";
import Header from '../Header/Header';
import {useQuery} from "react-query";
import ProjectForm from "./ProjectForm";
import AssessorService from "../../services/AssessorService";
import AssessorsPageRow from "../Assessors/AssessorsPageRows";
import ProjectMenu from "./ProjectMenu";
import DeleteFromProjects from "../AssessorManagement/DeleteFromProjects";
import {ToastContainer} from "react-toastify";
import AddToProject from "./AddToProject";
const statusObject = {
    "full":"Полная загрузка",
    "partial": "Частичная загрузка",
    "reserved": "Зарезервирован",
    }
const ProjectAssessors = () => {
        const {id} = useParams()
        const columnHelper = createColumnHelper<any>()
        const {data, isLoading} = useQuery(['projectAssessors', id], ()=>AssessorService.fetchAssessors(id))
        // прокинуть через пропс
        const projectName = useQuery(['projectName'], () => ProjectService.fetchProject(id), )
        const [addToProject, setAddToProject] = useState(false)
        const [addAssessor, setAddAssessor] = useState(false)
        const [idDeleteFromProject, setIsDeleteFromProject] = useState(false)
        const [selectedAssessors, setSelectedAssessors] = useState<any>([])
        const [assessorsProjects, setAssessorProjects] = useState<any>({})
        const isSelected =()=> {
            return Object.keys(assessorsProjects).length !== 0
        }
        if (isLoading) return <div>Загрузка</div>
        return (
            <div>
                <Dialog isOpen={addToProject} setIsOpen={setAddToProject}>
                    <AddToProject/>
                </Dialog>
                <Dialog isOpen={addAssessor} setIsOpen={setAddAssessor}>
                    <AddAssessorForm assessorId={projectName.data?.id} showSidebar={addAssessor}
                                     setShowSidebar={setAddAssessor}/>
                </Dialog>
                <Dialog isOpen={idDeleteFromProject} setIsOpen={setIsDeleteFromProject}>
                    <DeleteFromProjects projectId={id} assessorsProjects={assessorsProjects} close={setIsDeleteFromProject}/>
                </Dialog>
                <Header/>
                <div className="flex-col container mx-auto pt-[70px] pr-8 pl-8 items-center">
                    <div className="flex justify-between my-2">
                        <div className="flex items-center">
                            <div className="pl-[15px]">{projectName.data?.name}</div>
                        </div>
                        <div className='flex space-x-2'>
                            <ProjectMenu setIsDeleteFromProject={setIsDeleteFromProject} isSelected={isSelected}/>
                            <button className="bg-[#5970F6] text-white py-[8px] px-[15px] rounded-[8px]" onClick={() => setAddToProject(true)}>Добавить на проект</button>
                            <button className="bg-[#5970F6] text-white py-[8px] px-[15px] rounded-[8px]" onClick={() => setAddAssessor(true)}>Добавить ассессора</button>
                            <button className="bg-[#5970F6] text-white py-[8px] px-[15px] rounded-[8px]">Экспорт данных</button>
                        </div>
                    </div>
                    <div className="h-full w-full">
                        <div className="rounded-t-[20px] border border-b-gray-400 bg-white">
                            <table className='w-full'>
                                <thead>
                                <tr>
                                    <th rowSpan={2}></th>
                                    <th colSpan={3}>ФИО</th>
                                    <th colSpan={1} rowSpan={2}>Ник в тг</th>
                                    <th colSpan={7}>Количество рабочих часов</th>
                                    <th colSpan={1} rowSpan={2}>Всего</th>
                                    <th colSpan={1} rowSpan={2}>Статус</th>
                                    <th colSpan={1} rowSpan={2}>Навыки</th>
                                    <th colSpan={1} rowSpan={2}></th>
                                </tr>
                                <tr>

                                    <th>Фамилия</th>
                                    <th>Имя</th>
                                    <th>Отчество</th>
                                    <th>ПН</th>
                                    <th>ВТ</th>
                                    <th>СР</th>
                                    <th>ЧТ</th>
                                    <th>ПТ</th>
                                    <th>СБ</th>
                                    <th>ВС</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data?.results.map(assessor => <AssessorsPageRow assessorsProjects={assessorsProjects} setAssessorProjects={setAssessorProjects} selectedAssessors={selectedAssessors} setSelectedAssessors={setSelectedAssessors} key={assessor.id} assessorId={assessor.id} projectId={id}/>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
;

export default ProjectAssessors;