import React, {Dispatch, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../../../services/ProjectService";
import {Project} from "../../../../models/ProjectResponse";
import {Reason} from "../ChangeProjects/ChangeProjects";
import {Row} from "@tanstack/react-table";
import MyButton from "../../../UI/MyButton";
import Table from "../../../UI/Table";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {useRemoveAssessorsColumns} from "./columns";
import {Assessor} from "../../../../models/AssessorResponse";
import {useFetchProjects} from "../ChangeProjects/queries";
import {useFetchProjectsToDelete} from "./queries";
import {REMOVE_FROM_PROJECTS_REASONS} from "../../../../assets/consts";

const RemoveAssessorsFromProjects = ({assessorsRow, setAssessorsRow, show}: {
    assessorsRow: Row<Assessor>[],
    show: Dispatch<boolean>,
    setAssessorsRow: Dispatch<Row<Assessor>[]>
}) => {
    const {selectedRows, columns} = useRemoveAssessorsColumns()
    const {projects, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit} = useFetchProjectsToDelete({assessorsIds: assessorsRow.map(row => row.original.id).join(',')})
    const addToProject = useMutation('assessors', ({id, data}: any) => AssessorService.addAssessorProject(id, data));

    const queryClient = useQueryClient()

    const [selectedReason, setSelectedReason] = useState<string>()
    const submit = () => {
        if (!selectedReason) {
            errorNotification('Выберите причину')
        } else if (selectedRows.length === 0) {
            errorNotification('Выбери хотя бы 1 проект')
        } else {
            assessorsRow.forEach((assessor:any) => {
                const projects = assessor.original.projects.map((pr:Project) => {return pr.id})
                const newProjects = projects.filter((project:any) => selectedRows.find(pr => pr.original.id.toString() === project.toString()) === undefined)
                addToProject.mutate({id: assessor.original.id, data: {projects: newProjects, reason: selectedReason}}, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('assessors')
                        queryClient.invalidateQueries('rentAssessors')
                        queryClient.invalidateQueries('removeProjects')
                        successNotification('Ассессоры удалены с проекта')
                        setAssessorsRow([])
                        show(false)
                    }
                })
            })
        }
    }

    return (
        <div>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Удалить с проекта</h1>
                <div className='pb-4'>
                    {REMOVE_FROM_PROJECTS_REASONS.map(reason => <Reason key={reason.id} label={reason.label}
                                                   setSelectedReason={setSelectedReason} name={reason.name}
                                                   value={reason.value} id={reason.id}/>)}
                </div>
                <div>
                    <Table height='h-[calc(100vh-300px)]' data={projects.isSuccess ? projects.data.results: [] }  columns={columns} setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                           setCurrentPage={setCurrentPage}/>
                </div>
                <div className='flex justify-between space-x-2'>
                    <MyButton onClick={() => show(false)}>Назад</MyButton>
                    <MyButton onClick={submit}>Сохранить</MyButton>
                </div>
            </div>
        </div>
    );
};

export default RemoveAssessorsFromProjects;