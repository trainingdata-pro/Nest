import React, {useContext, useState} from 'react';
import {useQueryClient} from "react-query";
import {Context} from "../../../../index";
import {Project} from "../../../../models/ProjectResponse";
import {errorNotification, successNotification} from "../../../UI/Notify";
import Table from "../../../UI/Table";
import {
    getCoreRowModel,
    getPaginationRowModel, Row,
    useReactTable
} from "@tanstack/react-table";
import {columns} from "./columns";
import {useChangeAssessorProjects, useFetchProjects} from "./queries";
import MyButton from "../../../UI/MyButton";
import {Assessor} from "../../../../models/AssessorResponse";

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

const ChangeProjects = ({selectedAssessor, extendProjects, show, resetSelection}:{
    selectedAssessor: Row<Assessor>[],
    extendProjects: number[],
    show:  React.Dispatch<React.SetStateAction<boolean>>,
    resetSelection: any
}) => {
    const {store} = useContext(Context)
    const queryClient = useQueryClient()
    const [selectedReason, setSelectedReason] = useState<string>()
    const {data, isSuccess} = useFetchProjects({extendProjects: extendProjects})
    const {mutate} = useChangeAssessorProjects()
    const submit = () => {
        if (!selectedReason) {
            errorNotification('Выберите причину')
        } else if (Object.keys(rowSelection).length === 0) {
            errorNotification('Выбери хотя бы 1 проект')
        } else {
            filterProjects().forEach((assessor: any) =>
                mutate({
                    id: assessor.assessorId,
                    data: {projects: [...getSelectedProjects(), ...assessor.notMyProjects], reason: selectedReason},
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('assessors');
                        successNotification('Успешно')
                        show(false)
                        resetSelection(true)
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
        selectedAssessor.map((row:any) => {
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
        return assessorsProjects
    }
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data:isSuccess ? data : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        debugTable: false,
    })
    const getSelectedProjects = () => {
        return table.getPreFilteredRowModel().rows.filter(row => Object.keys(rowSelection).find(key => key.toString() === row.id.toString())).map(row => {
            return row.original.id
        })}
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
                <Table pages={true} rowSelection={rowSelection} table={table}/>
                <div className='flex justify-between space-x-2'>
                    <MyButton onClick={() => show(false)}>Назад</MyButton>
                    <MyButton onClick={submit}>Сохранить</MyButton>
                </div>
            </div>
        </div>
    );
};

export default ChangeProjects;