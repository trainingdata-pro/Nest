import React, {Dispatch, useState} from 'react';
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {Project} from "../../../../models/ProjectResponse";
import Table from "../../../UI/Table";
import {Row} from "@tanstack/react-table";
import {Reason} from '../ChangeProjects/ChangeProjects';
import {Assessor} from "../../../../models/AssessorResponse";
import {useMyAssessorsColumn} from "./columns";
import MyButton from "../../../UI/MyButton";
import {useFetchExcludedProjects} from "./queries";


const AddToProject = ({assessorsRow, show, setAssessorsRow}: {
    assessorsRow: Row<Assessor>[],
    show: Dispatch<boolean>,
    setAssessorsRow: Dispatch<Row<Assessor>[]>
}) => {
    const {selectedRows, columns} = useMyAssessorsColumn()
    const queryClient = useQueryClient()
    const {projects, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit} = useFetchExcludedProjects({assessorsIds: assessorsRow.map(row => row.original.id).join(',')})
    const addToProject = useMutation('assessors', ({id, data}: any) => AssessorService.addAssessorProject(id, data));

    const postWorkloadStatus = useMutation(['assessors'], async ({data}: any) => AssessorService.createWorkloadStatus(data), {})

    const [workloadStatus, setWorkloadStatus] = useState('')
    const patchWorkloadStatus = useMutation(['assessors'], ({id, data}: {
        id: string | number | undefined,
        data: any
    }) => AssessorService.patchWorkloadStatus(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workloadStatus')
        }
    })
    const submit = () => {
        if (selectedRows.length === 0) {
            errorNotification('Выбери хотя бы 1 проект')
        } else {
            assessorsRow.forEach((assessor: any) => {
                const assessorsProjects = assessor.original.projects.map((project: Project) => project.id)
                addToProject.mutate({
                    id: assessor.original.id,
                    data: {projects: [...assessorsProjects, ...selectedRows.map(row => row.original.id)]}
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('assessors');
                        successNotification('Асессоры добавлены на проект(ы)')
                        show(false)
                    }
                })
            })
            assessorsRow.forEach((assessor: any) => {
                const assessorsProjects = [...selectedRows.map(row => row.original.id)]
                assessorsProjects.forEach((project: number) => {
                    AssessorService.fetchWorkloadStatus(assessor.original.id, project).then(res => {
                        if (res.results.length === 0) {
                            postWorkloadStatus.mutate({
                                data: {
                                    assessor: assessor.original.id,
                                    project: project,
                                    status: workloadStatus
                                }
                            }, {
                                onSuccess: () => {
                                    successNotification('Статусы ассеора(ов) обновлены')
                                }
                            })
                        } else {
                            patchWorkloadStatus.mutate({id: res.results[0].id, data: {status: workloadStatus}}, {
                                onSuccess: () => {
                                    successNotification('Статусы ассеора(ов) обновлены')
                                }

                            })
                        }
                        setAssessorsRow([])
                    })
                })

            })
        }
    }


    const reasons = [
        {id: 'reason1', label: 'Полная загрузка', value: 'full', name: 'reason'},
        {id: 'reason2', label: 'Частичная загрузка', value: 'partial', name: 'reason'},
        {id: 'reason3', label: 'Зарезервирован', value: 'reserved', name: 'reason'},
    ]
    return (
        <div>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Аренда ассессора</h1>
                <div className='bg-white pb-4'>
                    {reasons.map(reason => <Reason key={reason.id} label={reason.label}
                                                   setSelectedReason={setWorkloadStatus}
                                                   name={reason.name} value={reason.value} id={reason.id}/>)}
                </div>
                <div>
                    <Table data={projects.isSuccess ? projects.data.results : []}  columns={columns} pages={true} setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
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

export default AddToProject;