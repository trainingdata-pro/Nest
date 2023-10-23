import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../services/ProjectService";
import AssessorService from "../../services/AssessorService";
import {errorNotification, successNotification} from "../UI/Notify";
import {Project} from "../../models/ProjectResponse";
import Table from "../UI/Table";
import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import TableCheckBox from "../UI/TableCheckBox";
import {Reason} from './ChangeProjects';

// @ts-ignore
const AddToProject = ({selectedAssessor, extendProjects, show}) => {
    const columnHelper = createColumnHelper<Project>()
    const columns = [
        columnHelper.accessor('id', {
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
    const queryClient = useQueryClient()
    const projects = useQuery(['projects'], () => fetchAllData(), {
        select: data => data.filter(project => extendProjects.find((projectId: number) => projectId === project.id) === undefined)
    })
    async function fetchAllData() {
        const allData = [];
        let currentPage = 1;
        let hasMoreData = true;
        while (hasMoreData) {
            const data = await ProjectService.fetchProjects(currentPage);
            allData.push(...data.results);
            if (data.next !== null) {
                currentPage++;
            } else {
                hasMoreData = false;
            }
        }
        return allData;
    }

    const addToProject = useMutation('assessors', async ({id, data}: any) => AssessorService.addAssessorProject(id, data));
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data: projects.data ? projects.data : [] as Project[],
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
    const postWorkloadStatus = useMutation(['assessors'], async ({data}: any) => AssessorService.createWorkloadStatus(data), {})
    const getSelectedProjects = () => {
        return table.getPreFilteredRowModel().rows.filter(row => Object.keys(rowSelection).find(key => key.toString() === row.id.toString())).map(row => {
            return row.original.id
        })
    }
    const [workloadStatus, setWorkloadStatus] = useState('')
    const patchWorkloadStatus = useMutation(['assessors'], ({id, data}: { id: string | number | undefined, data: any }) => AssessorService.patchWorkloadStatus(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workloadStatus')
        }
    })
    const submit = () => {
        if (Object.keys(rowSelection).length === 0) {
            errorNotification('Выбери хотя бы 1 проект')
        } else {
            selectedAssessor.forEach((assessor: any) => {
                const assessorsProjects = assessor.original.projects.map((project: any) => project.id)
                addToProject.mutate({
                    id: assessor.original.id,
                    data: {projects: [...assessorsProjects, ...getSelectedProjects()]}
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries('assessors');
                        successNotification('Успешно')
                        show(false)
                        table.resetRowSelection()
                    }
                })
            })
            selectedAssessor.forEach((assessor: any) => {
                const assessorsProjects = getSelectedProjects()
                assessorsProjects.forEach((project: number) => {
                    AssessorService.fetchWorkloadStatus(assessor.original.id, project).then(res => {
                        if (res.results.length === 0) {
                            postWorkloadStatus.mutate({data: {assessor: assessor.original.id, project: project, status: workloadStatus}}, {
                                onSuccess: () => {
                                    successNotification('Успешно')
                                }
                            })
                        } else {
                            patchWorkloadStatus.mutate({id: res.results[0].id, data: {status: workloadStatus}}, {
                                onSuccess: () => {
                                    successNotification('Статусы обновлены')
                                }

                            })
                        }
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
                    {/*<Table pages={true} rowSelection={rowSelection} table={table}/>*/}
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

    export default AddToProject;