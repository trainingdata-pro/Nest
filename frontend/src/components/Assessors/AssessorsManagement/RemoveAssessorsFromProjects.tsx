import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../../services/ProjectService";
import {Project} from "../../../models/ProjectResponse";

import {Reason} from "./ChangeProjects/ChangeProjects";
import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import TableCheckBox from "../../UI/TableCheckBox";
import MyButton from "../../UI/MyButton";
import Table from "../../UI/Table";
import AssessorService from "../../../services/AssessorService";
import {errorNotification, successNotification} from "../../UI/Notify";

// @ts-ignore
const RemoveAssessorsFromProjects = ({assessorsProjects, assessorsRow, show}) => {
    const columnHelperT = createColumnHelper<Project>()
    const columns = [
        columnHelperT.accessor('id', {
            header: ({table}) => (
                <TableCheckBox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({row}) => (
                <div className="px-1">
                    <TableCheckBox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
            enableSorting: false,
            maxSize: 30
        }),
        columnHelperT.accessor('asana_id', {
            header: 'Asana ID',
            cell: info => info.getValue(),
            enableSorting: false,

        }),
        columnHelperT.accessor('name', {
            cell: info => info.getValue(),
            header: 'Название',
            enableSorting: false
        }),
        columnHelperT.accessor('assessors_count', {
            header: 'Количество ассессеров',
            cell: info => info.getValue(),
            enableSorting: false
        })
    ]

    const projects = useQuery(['removeProjects'], () => ProjectService.fetchProjects(), {
        onSuccess: data => {
            setCurrentAssessorProjects([...data.results.filter(project => assessorsProjects.find((pr: any) => pr.toString() === project.id.toString()) !== undefined)])
        }
    })
    const [currentAssessorsProjects, setCurrentAssessorProjects] = useState<Project[]>([])
    const addToProject = useMutation('assessors', async ({id, data}: any) => await AssessorService.addAssessorProject(id, data));
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data: currentAssessorsProjects,
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
    const queryClient = useQueryClient()
    const getSelectedProjects = () => {

        return table.getPreFilteredRowModel().rows.filter(row => Object.keys(rowSelection).find(key => key.toString() === row.id.toString())).map(row => {
            return row.original.id
        })}
    const [selectedReason, setSelectedReason] = useState<string>()
    const submit = () => {
        if (!selectedReason) {
            errorNotification('Выберите причину')
        } else if (Object.keys(rowSelection).length === 0) {
            errorNotification('Выбери хотя бы 1 проект')
        } else {
            assessorsRow.forEach((assessor:any) => {
                const projects = assessor.original.projects.map((pr:Project) => {return pr.id})
                const newProjects = projects.filter((project:any) => getSelectedProjects().find(pr => pr.toString() === project.toString()) === undefined)
                addToProject.mutate({id: assessor.original.id, data: {projects: newProjects, reason: selectedReason}}, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('assessors')
                        successNotification('Ассессоры удалены с проекта')
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
                    <Table pages={true} rowSelection={rowSelection} table={table}/>
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