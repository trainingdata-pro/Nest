import React, {useContext, useState} from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../services/AssessorService";
import {useNavigate} from "react-router-dom";
import TableCheckBox from "../UI/TableCheckBox";
import {
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import Dialog from "../UI/Dialog";
import AddAssessorForm from "./AddAssessorForm";
import ChangeProjects from "./AssessorsManagement/ChangeProjects/ChangeProjects";
import AddToProject from "./AssessorsManagement/AddToProject";
import RemoveAssessorsFromProjects from "./AssessorsManagement/RemoveAssessorsFromProjects";
import Header from "../Header/Header";
import MyButton from "../UI/MyButton";
import AssessorsManagement from "./AssessorsManagement/AssessorsManagement";
import MyTable from "../UI/Table";
import {Assessor} from "../../models/AssessorResponse";
import {Context} from "../../index";
const columnHelper = createColumnHelper<Assessor>()
const stateObject = {
    "available": "Доступен",
    "busy": "Занят",
    "free_resource": "Свободный ресурс",
    "vacation": "Отпуск",
    "blacklist": "Черный список",
    "fired": "Уволен",
}
const RentAssessors = () => {
    const [assessorsType, setAssessorsType] = useState('rent')
    const navigate = useNavigate()
    const assessors = useQuery(['assessors', assessorsType], () => fetchAllData())
    const {store} = useContext(Context)
    async function fetchAllData() {
        const allData = [];
        let currentPage = 1;
        let hasMoreData = true;
        while (hasMoreData) {
            const data = await AssessorService.fetchManagersAssessors(currentPage, '', store.user_id);
            allData.push(...data.results);
            if (data.next !== null) {
                currentPage++;
            } else {
                hasMoreData = false;
            }
        }
        return allData;
    }

    const navigation = useNavigate()
    const columns = [
        // columnHelper.accessor('id', {
        //     header: ({table}) => (
        //         <TableCheckBox
        //             {...{
        //                 checked: table.getIsAllRowsSelected(),
        //                 indeterminate: table.getIsSomeRowsSelected(),
        //                 onChange: table.getToggleAllRowsSelectedHandler(),
        //             }}
        //         />
        //     ),
        //     cell: ({row}) => (
        //         <div className="px-1">
        //             <TableCheckBox
        //                 {...{
        //                     checked: row.getIsSelected(),
        //                     disabled: !row.getCanSelect(),
        //                     indeterminate: row.getIsSomeSelected(),
        //                     onChange: row.getToggleSelectedHandler(),
        //                 }}
        //             />
        //         </div>
        //     ),
        //     enableSorting: false,
        //     maxSize: 30
        // }),
        columnHelper.accessor('last_name', {
            header: 'Фамилия',
            cell: info =>
                <div className='w-full h-full text-center  cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            enableSorting: false,

        }),
        columnHelper.accessor('first_name', {
            cell: info =>
                <div className='w-full h-full text-center cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            header: 'Имя',
            enableSorting: false
        }),
        columnHelper.accessor('middle_name', {
            header: 'Отчество',
            cell: info =>
                <div className='w-full h-full text-center cursor-pointer'
                     onClick={() => navigation(`/assessor/${info.row.original.id}`)}>{info.getValue()}</div>,
            enableSorting: false
        }),
        columnHelper.accessor('username', {
            header: 'Ник в ТГ',
            cell: info => info.renderValue(),
            enableSorting: false
        }),
        columnHelper.accessor('projects', {
            header: 'Проект',
            cell: info => info.row.original.projects.map(project => project.name).join(', '),
            enableSorting: false
        }),
        columnHelper.accessor('working_hours', {
            header: 'Всего рабочих часов',
            cell: info => info.row.original.working_hours.map(wh => wh.total).reduce((a, v) => a = a + v, 0),
            enableSorting: false,
            maxSize: 120
        }),
        columnHelper.accessor('state', {
            header: 'Состояние',
            cell: info => stateObject[info.row.original.state],
            enableSorting: false
        }),
        columnHelper.accessor('skills', {
            header: 'Навыки',
            cell: info => info.row.original.skills.map(skill => skill.title).join(', '),
            enableSorting: false
        }),
    ]
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data: assessors.data ? assessors.data : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: "includesString",
        state: {
            rowSelection,
            sorting
        },
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        debugTable: false,
    })

    const getUnavailableProjects = () => {
        let projects: any[] = []
        const rows = table.getPreFilteredRowModel().rows.filter(row => Object.keys(rowSelection).find(key => key.toString() === row.id.toString()))
        projects = rows.map(row => [...projects, ...row.original.projects.map(project => project.id)])
        projects = Array.from(new Set([].concat(...projects)))
        return projects
    }

    const getSelectedAssessors = () => {
        return table.getPreFilteredRowModel().rows.filter(row => Object.keys(rowSelection).find(key => key.toString() === row.id.toString()))
    }
    const [showSidebar, setShowSidebar] = useState(false)
    const [showChangeProject, setShowChangeProject] = useState(false)
    const [showAddProject, setShowAddProject] = useState(false)
    const [showRemoveAssessors, setShowRemoveAssessors] = useState(false)
    return (
        <div>
            <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                <AddAssessorForm assessorId={undefined} project={undefined} setShowSidebar={setShowSidebar}/>
            </Dialog>
            <Dialog isOpen={showChangeProject} setIsOpen={setShowChangeProject}>
                <ChangeProjects show={setShowChangeProject} selectedAssessor={getSelectedAssessors()}
                                extendProjects={getUnavailableProjects()} resetSelection={table.resetRowSelection}/>
            </Dialog>
            <Dialog isOpen={showAddProject} setIsOpen={setShowAddProject}>
                <AddToProject show={setShowAddProject} selectedAssessor={getSelectedAssessors()}
                              extendProjects={getUnavailableProjects()}/>
            </Dialog>
            <Dialog isOpen={showRemoveAssessors} setIsOpen={setShowRemoveAssessors}>
                <RemoveAssessorsFromProjects assessorsRow={getSelectedAssessors()}
                                             assessorsProjects={getUnavailableProjects()}
                                             show={setShowRemoveAssessors}/>
            </Dialog>
            <Header/>
            <div className='pt-20'>
                <div className='flex justify-between'>
                    <nav className='px-8 flex justify-start mb-2 space-x-2'>
                        <MyButton onClick={() => navigate('/dashboard/assessors/my')}>Привязанные ассессоры</MyButton>
                        <MyButton onClick={() => setAssessorsType('rent')}>Арендованные ассессоры</MyButton>
                    </nav>
                    <div className='px-8 flex justify-start mb-2 space-x-2'><p className='my-auto'>Арендованные ассессоры</p></div>
                    <nav className='px-8 flex justify-end mb-2 space-x-2'>
                        <AssessorsManagement type={assessorsType} setShowRemoveAssessors={setShowRemoveAssessors}
                                             setShowAddProject={setShowAddProject}
                                             availableAddProject={getSelectedAssessors().length !== 0}
                                             availableChangeProject={getSelectedAssessors().length !== 0}
                                             setShowChangeProject={setShowChangeProject}/>
                        <MyButton onClick={() => setShowSidebar(true)}>Создать асессора</MyButton>
                    </nav>
                </div>
                <div className="flex px-8">
                    <MyTable table={table}/>
                </div>

            </div>
        </div>
    );
};

export default RentAssessors;