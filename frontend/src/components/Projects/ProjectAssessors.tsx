import React, {useEffect, useMemo, useState} from 'react';
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {
    ColumnDef,
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
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
import MyButton from "../UI/MyButton";
import TableCheckBox from "../UI/TableCheckBox";
import Export from "./Export";


const statusObject = {
    "full": "Полная загрузка",
    "partial": "Частичная загрузка",
    "reserved": "Зарезервирован",
}

const ProjectAssessors = () => {
        const {id} = useParams()
        const columnHelper = createColumnHelper<any>()
        const navigate = useNavigate()
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
            columnHelper.group({
                header: 'ФИО',
                columns: [
                    columnHelper.accessor('last_name', {
                        header: () => <span>Фамилия</span>,
                        cell: info => <span className='cursor-pointer h-full w-full text-center'
                                            onClick={() => navigate(`/assessor/${info.row.original.id}/`)}>{info.getValue()}</span>,
                        enableSorting: false
                    }),
                    columnHelper.accessor('first_name', {
                        cell: info => <span className='cursor-pointer h-full w-full text-center'
                                            onClick={() => navigate(`/assessor/${info.row.original.id}/`)}>{info.getValue()}</span>,
                        header: () => <span>Имя</span>,
                        enableSorting: false
                    }),
                    columnHelper.accessor('middle_name', {
                        cell: info => <span className='cursor-pointer h-full w-full text-center'
                                            onClick={() => navigate(`/assessor/${info.row.original.id}/`)}>{info.getValue()}</span>,
                        header: () => <span>Отчество</span>,
                        enableSorting: false
                    })
                ],
            }),

            columnHelper.accessor('username', {
                header: () => 'Ник в ТГ',
                cell: info => info.getValue(),
                enableSorting: false,
            }),
            columnHelper.group({
                header: 'Количество рабочих часов',
                columns: [
                    columnHelper.accessor('working_hours.monday', {
                        header: () => 'ПН',
                        cell: info => info.row.original.working_hours ? info.getValue() : 0,
                        enableSorting: false
                    }),
                    columnHelper.accessor('working_hours.tuesday', {
                        header: () => 'ВТ',
                        enableSorting: false,
                        cell: info => info.row.original.working_hours ? info.getValue() : 0,

                    }),
                    columnHelper.accessor('working_hours.wednesday', {
                        header: () => 'СР',
                        cell: info => info.row.original.working_hours ? info.getValue() : 0,

                        enableSorting: false
                    }),
                    columnHelper.accessor('working_hours.thursday', {
                        header: () => 'ЧТ',
                        cell: info => info.row.original.working_hours ? info.getValue() : 0,

                        enableSorting: false
                    }),
                    columnHelper.accessor('working_hours.friday', {
                        header: () => 'ПТ',
                        cell: info => info.row.original.working_hours ? info.getValue() : 0,

                        enableSorting: false
                    }),
                    columnHelper.accessor('working_hours.saturday', {
                        header: () => 'СБ',
                        cell: info => info.row.original.working_hours ? info.getValue() : 0,

                        enableSorting: false
                    }),
                    columnHelper.accessor('working_hours.sunday', {
                        header: () => 'ВС',
                        cell: info => info.row.original.working_hours ? info.getValue() : 0,

                        enableSorting: false
                    }),
                ],
            }),
            columnHelper.accessor('working_hours.total', {
                header: () => 'Всего',
                cell: info => info.row.original.working_hours ? info.getValue() : 0,

                enableSorting: false
            }),
            columnHelper.accessor('workload_status', {
                header: () => 'Статус',
                // @ts-ignore
                cell: info => info.row.original.workload_status ? statusObject[info.row.original.workload_status] : '',

                enableSorting: false
            }),
            columnHelper.accessor('skills', {
                header: () => 'Навыки',
                cell: info => info.getValue().map((skill: any) => skill.title).join(', '),

                enableSorting: false,

            }),
        ]
        const {data, isLoading} = useQuery(['projectAssessors', id], () => AssessorService.fetchAssessors(id), {
            onSuccess: data1 => {
                data1.results.map((assessor: any) => {
                    assessor.working_hours = assessor.working_hours.find((wh: any) => wh.project.id.toString() === id?.toString())
                    assessor.workload_status = assessor.workload_status.find((ws: any) => ws.project.id.toString() === id?.toString())?.status
                    assessor.projects = assessor.projects.map((project: any) => project.id)
                })
            }
        })

        const [sorting, setSorting] = React.useState<SortingState>([])
        const [rowSelection, setRowSelection] = React.useState({})
        const table = useReactTable({
            data: data ? data.results : [],
            columns,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            onSortingChange: setSorting,
            getSortedRowModel: getSortedRowModel(),
            enableMultiSort: true,
            maxMultiSortColCount: 2,
            state: {
                rowSelection,
                sorting
            },
            enableRowSelection: true,
            onRowSelectionChange: setRowSelection,
            debugTable: false,
        })
        const getSelectedAssessors = () => {
            return table.getPreFilteredRowModel().rows.filter(row => Object.keys(rowSelection).find(key => key.toString() === row.id.toString()))
        }
        // прокинуть через пропс
        const projectName = useQuery(['projectName'], () => ProjectService.fetchProject(id),)
        const [addToProject, setAddToProject] = useState(false)
        const [addAssessor, setAddAssessor] = useState(false)
        const [idDeleteFromProject, setIsDeleteFromProject] = useState(false)
        const [isExportAssessors, setIsExportAssessors] = useState(false)

        if (isLoading) return <div>Загрузка</div>
        return (
            <div>
                <Dialog isOpen={addToProject} setIsOpen={setAddToProject}>
                    <AddToProject setAddToProject={setAddToProject}/>
                </Dialog>
                <Dialog isOpen={addAssessor} setIsOpen={setAddAssessor}>
                    <AddAssessorForm assessorId={projectName.data?.id} showSidebar={addAssessor}
                                     setShowSidebar={setAddAssessor}/>
                </Dialog>
                <Dialog isOpen={idDeleteFromProject} setIsOpen={setIsDeleteFromProject}>
                    <DeleteFromProjects projectId={id} assessorsProjects={getSelectedAssessors()}
                                        close={setIsDeleteFromProject}/>
                </Dialog>
                <Dialog isOpen={isExportAssessors} setIsOpen={setIsExportAssessors}>
                    <Export setIsExportProjects={setIsExportAssessors} exportType='projectAssessors' project={id}/>
                </Dialog>
                <Header/>
                <div className="flex-col container mx-auto pt-[70px] pr-8 pl-8 items-center">
                    <div className="flex justify-between my-2">
                        <div className="flex items-center">
                            <div className="pl-[15px]">{projectName.data?.name}</div>
                        </div>
                        <div className='flex space-x-2'>
                            <ProjectMenu setIsDeleteFromProject={setIsDeleteFromProject}
                                         isSelected={Object.keys(rowSelection).length !== 0}/>
                            <MyButton onClick={() => setAddToProject(true)}>Добавить на проект</MyButton>
                            <MyButton onClick={() => setAddAssessor(true)}>Добавить ассессора</MyButton>
                            <MyButton onClick={() => setIsExportAssessors(true)}>Экспорт данных</MyButton>
                        </div>
                    </div>
                    <Table pages={true} rowSelection={rowSelection} table={table}/>
                </div>

            </div>
        );
    }
;

export default ProjectAssessors;