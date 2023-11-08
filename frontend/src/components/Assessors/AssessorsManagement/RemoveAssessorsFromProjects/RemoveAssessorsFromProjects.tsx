import React, {Dispatch, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../../../services/ProjectService";
import {Project} from "../../../../models/ProjectResponse";
import {Reason} from "../ChangeProjects/ChangeProjects";
import {getCoreRowModel, getPaginationRowModel, Row, useReactTable} from "@tanstack/react-table";
import MyButton from "../../../UI/MyButton";
import Table from "../../../UI/Table";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {useRemoveAssessorsColumns} from "./columns";
import TablePagination from "../../../UI/TablePagination";
import {Assessor} from "../../../../models/AssessorResponse";

const RemoveAssessorsFromProjects = ({assessorsRow, setAssessorsRow, show}: {
    assessorsRow: Row<Assessor>[],
    show: Dispatch<boolean>,
    setAssessorsRow: Dispatch<Row<Assessor>[]>
}) => {
    const {selectedRows, columns} = useRemoveAssessorsColumns()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)

    const projects = useQuery('removeProjects', () => ProjectService.fetchProjects(currentPage,''), {
        onSuccess: data => {
            let assessorsProjects:number[] = []
            assessorsRow.map(row => row.original.projects.map((project: Project) => assessorsProjects.push(project.id)))
            const res = [...data.results.filter(project => assessorsProjects.find(pr => pr.toString() === project.id.toString()) !== undefined)]
            setAvailableProjects(res)
            setTotalRows(res.length)
            setTotalPages(Math.ceil(res.length / 10))
        },
    })
    const [availableProjects, setAvailableProjects] = useState<Project[]>([])
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
    const reasons = [
        {
            id: 'reason1',
            value: 'Не смог работать со спецификой проекта',
            name: 'reason',
            label: 'Не смог работать со спецификой проекта'
        },
        {id: 'reason2', value: 'Не сработались', name: 'reason', label: 'Не сработались'},
        {id: 'reason3', value: 'Не понадобился', name: 'reason', label: 'Не понадобился'},
        {id: 'reason4', value: 'Усиление другого проекта', name: 'reason', label: 'Усиление другого проекта'}]
    return (
        <div>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Удалить с проекта</h1>
                <div className='pb-4'>
                    {reasons.map(reason => <Reason key={reason.id} label={reason.label}
                                                   setSelectedReason={setSelectedReason} name={reason.name}
                                                   value={reason.value} id={reason.id}/>)}
                </div>
                <div>
                    <Table data={projects.isSuccess ? availableProjects: [] ? availableProjects : []}  columns={columns} pages={true} setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
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