import React, {Dispatch, useContext, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Context} from "../../../../index";
import {Project} from "../../../../models/ProjectResponse";
import {errorNotification, successNotification} from "../../../UI/Notify";
import Table from "../../../UI/Table";
import {
    getCoreRowModel,
    Row,
    useReactTable
} from "@tanstack/react-table";
import {useChangeAssessorsColumns} from "./columns";
import MyButton from "../../../UI/MyButton";
import {Assessor} from "../../../../models/AssessorResponse";
import ProjectService from "../../../../services/ProjectService";
import TablePagination from "../../../UI/TablePagination";
import AssessorService from "../../../../services/AssessorService";
import {useFetchProjects} from "./queries";

export const Reason = ({setSelectedReason,name, value,id, label}:{
    setSelectedReason:  any
    name: string,
    value: string,
    id: string,
    label: string
}) => {
    return (
        <div className='flex justify-start'>
            <input name={name} onChange={(event) => setSelectedReason(event.target.value)} id={id}
                   type="radio" value={value}/>
            <label className="ml-[5px]" htmlFor={id}>{label}</label>
        </div>
    )
}

const ChangeProjects = ({assessorsRow, show, setAssessorsRow}:{
    assessorsRow: Row<Assessor>[],
    show:  React.Dispatch<React.SetStateAction<boolean>>,
    setAssessorsRow: Dispatch<Row<Assessor>[]>
}) => {
    const {selectedRows, columns} = useChangeAssessorsColumns()
    const {store} = useContext(Context)
    const queryClient = useQueryClient()

    const {projects, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit} = useFetchProjects({assessorsIds: assessorsRow.map(row => row.original.id).join(',')})
    const [selectedReason, setSelectedReason] = useState<string>()
    const {mutate} = useMutation('assessors', ({id, data}: any) => AssessorService.addAssessorProject(id, data))
    const submit = () => {
        if (!selectedReason) {
            errorNotification('Выберите причину')
        } else if (selectedRows.length === 0) {
            errorNotification('Выбери хотя бы 1 проект')
        } else {
            filterProjects().forEach((assessor: any) =>
                mutate({
                    id: assessor.assessorId,
                    data: {projects: [...selectedRows.map(row => row.original.id), ...assessor.notMyProjects], reason: selectedReason},
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('assessors');
                        successNotification('Успешно')
                        setAssessorsRow([])
                        show(false)
                    },
                    onError: () => {
                        errorNotification('Ошибка')
                    }
                })
            );
        }
    }
    const filterProjects = () => {
        let assessorsProjects:any[] = []
        // eslint-disable-next-line array-callback-return
        if (store.user_data.is_teamlead) {
            assessorsRow.map((row:any) => {
                let myProjects:number[] = []
                let notMyProjects:number[] = []
                // eslint-disable-next-line array-callback-return
                row.original.projects.map((project: Project) => {
                    if (project.manager.find(manager => store.team.find(man => man.user.id.toString() === manager.id.toString())) !== undefined) {
                        myProjects.push(project.id)
                    } else {
                        notMyProjects.push(project.id)
                    }
                })
                assessorsProjects.push({'myProjects': myProjects, 'notMyProjects': notMyProjects,'assessorId': row.original.id})
            })
        } else {
            assessorsRow.map((row:any) => {
                let myProjects:number[] = []
                let notMyProjects:number[] = []
                // eslint-disable-next-line array-callback-return
                row.original.projects.map((project: Project) => {
                    if (project.manager.find(manager => manager.id.toString() === store.user_id.toString()) !== undefined) {
                        myProjects.push(project.id)
                    } else {
                        notMyProjects.push(project.id)
                    }
                })
                assessorsProjects.push({'myProjects': myProjects, 'notMyProjects': notMyProjects,'assessorId': row.original.id})
            })
        }
        return assessorsProjects
    }

    const reasons = [
        {id: 'reason1', value: 'Не смог работать со спецификой проекта',name: 'reason',label: 'Не смог работать со спецификой проекта'},
        {id: 'reason2', value: 'Не сработались',name: 'reason', label: 'Не сработались'},
        {id: 'reason3', value: 'Не понадобился',name: 'reason', label: 'Не понадобился'},
        {id: 'reason4', value: 'Усиление другого проекта',name: 'reason',label: 'Усиление другого проекта'}]
    return (
        <div>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Изменение проекта</h1>
                <div className='bg-white pb-4'>
                    {reasons.map(reason => <Reason key={reason.id} label={reason.label} setSelectedReason={setSelectedReason} name={reason.name} value={reason.value} id={reason.id}/>)}
                </div>
                <Table data={projects.isSuccess ? projects.data.results : []}  columns={columns} pages={true} setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                       setCurrentPage={setCurrentPage}/>
                <div className='flex justify-between space-x-2'>
                    <MyButton onClick={() => show(false)}>Назад</MyButton>
                    <MyButton onClick={submit}>Сохранить</MyButton>
                </div>
            </div>
        </div>
    );
};

export default ChangeProjects;