import React, {useContext, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";
import ProjectService from "../../services/ProjectService";
import {Context} from "../../index";
import {Project} from "../../models/ProjectResponse";
import {errorNotification, successNotification} from "../UI/Notify";
import Table from "../UI/Table";
import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import TableCheckBox from "../UI/TableCheckBox";

const Reason = ({setSelectedReason,name, value,id}:{
    setSelectedReason:  React.Dispatch<React.SetStateAction<string | undefined>>
    name: string,
    value: string,
    id: number | string
}) => {
    return (
        <div className='flex justify-start'>
            <input name={name} onChange={(event) => setSelectedReason(event.target.value)} id={id.toString()}
                   type="radio" value={value}/>
            <label className="ml-[5px]" htmlFor={id.toString()}>{value}</label>
        </div>
    )
}
// @ts-ignore
const ChangeProjects = ({selectedAssessor, extendProjects, show}) => {
    const columnHelper = createColumnHelper<Project>()
    const columns = [
        columnHelper.accessor('id', {
            header: ({ table }) => (
                <TableCheckBox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
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
        columnHelper.accessor('asana_id', {
            header: 'Asana ID',
            cell: info => info.getValue(),
            enableSorting: false,

        }),
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: 'Название',
            enableSorting: false
        }),
        columnHelper.accessor('assessors_count', {
            header: 'Количество ассессеров',
            cell: info => info.getValue(),
            enableSorting: false
        })
    ]
    const {store} = useContext(Context)
    const queryClient = useQueryClient()
    const [selectedReason, setSelectedReason] = useState<string>()
    const projects = useQuery(['projects'], () => ProjectService.fetchProjects(store.user_id), {
        onSuccess: data => {
            setAvailableProjects([...data.results.filter(project => extendProjects.find((projectId: number) => projectId === project.id) === undefined)])
        }
    })
    const addToProject = useMutation('assessors', async ({id, data}: any) => await AssessorService.addAssessorProject(id, data));
    const [availableProjects, setAvailableProjects] = useState<Project[]>([])

    const submit = () => {
        if (!selectedReason) {
            errorNotification('Выберите причину')
        } else if (Object.keys(rowSelection).length === 0) {
            errorNotification('Выбери хотя бы 1 проект')
        } else {
            const mutationPromises = selectedAssessor.map((assessor: any) =>
                addToProject.mutateAsync({
                    id: assessor,
                    data: {projects: getSelectedProjects(), reason: selectedReason},
                })
            );
            Promise.all(mutationPromises)
                .then(() => {
                    queryClient.invalidateQueries('assessors');
                    successNotification('Успешно')
                    show(false)
                })
                .catch((error) => {
                    errorNotification('Ошибка')
                });
        }
    }
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data: availableProjects.length !== 0 ? availableProjects : [],
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
        return table.getRowModel().rows.filter(row => Object.keys(rowSelection).find(key => key.toString() === row.id.toString())).map(row => {
            return row.original.id
        })}
    const reasons = [
        {id: 1, value: 'Не смог работать со спецификой проекта',name: 'reason'},
        {id: 2, value: 'Не сработались',name: 'reason'},
        {id: 3, value: 'Не понадобился',name: 'reason'},
        {id: 4, value: 'Усиление другого проекта',name: 'reason'}]
    return (
        <div>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Аренда ассессора</h1>
                <div className='bg-white pb-4'>
                    {reasons.map(reason => <Reason key={reason.id} setSelectedReason={setSelectedReason} name={reason.name} value={reason.value} id={reason.id}/>)}
                </div>
                <Table pages={true} rowSelection={rowSelection} table={table}/>
                <div className='flex space-x-2'>
                    <button className='bg-[#5970F6] text-white w-full rounded-md mt-2 py-2'
                            onClick={() => show(false)}>Назад
                    </button>
                    <button className='bg-[#5970F6] text-white w-full rounded-md mt-2 py-2'
                            onClick={submit}>Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeProjects;