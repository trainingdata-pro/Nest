import React, {useState} from 'react';
import ProjectService from '../../services/ProjectService';
import {observer} from "mobx-react-lite";
import Loader from "../UI/Loader";
import ProjectForm from "./ProjectForm";
import Dialog from "../UI/Dialog";
import {useQuery} from "react-query";
import Table from "../UI/Table";
import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Project} from "../../models/ProjectResponse";
import {useNavigate} from "react-router-dom";
import MyButton from "../UI/MyButton";

const statusObject = {
    "active": "Активный",
    "pause": "На паузе",
    "completed": "Завершенный"
}
const PersonalAccountTable = () => {
    const columnHelper = createColumnHelper<Project>()
    const navigation = useNavigate()
    const columns = [
        columnHelper.accessor('asana_id', {
            header: 'Asana ID',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('name', {
            cell: info => <div className="cursor-pointer h-full w-full text-center break-all" onClick={() => {
                setProjectId(info.row.original.id)
                setShowSidebar(true)
            }}>{info.getValue()}</div>,
            header: 'Название',
            enableSorting: false
        }),
        columnHelper.accessor('manager', {
            header: 'Менеджер',
            cell: info => info.getValue().map(manager => {
                return `${manager.last_name} ${manager.first_name}`
            }),
            enableSorting: false
        }),
        columnHelper.accessor('assessors_count', {
            header: 'Количество ассессеров',
            cell: info => <div className="cursor-pointer h-full w-full text-center break-all"
                              onClick={() => navigation(`/dashboard/projects/${info.row.original.id}/assessors`)}>{info.getValue()}</div>,
            enableSorting: true
        }),
        columnHelper.accessor('status', {
            header: 'Статус',
            cell: ({row}) => statusObject[row.original.status],
            enableSorting: true
        })
    ]
    const {
        data,
        isLoading,
    } = useQuery(['projects'], () => fetchAllData(), {
        keepPreviousData: true
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

    const [projectsId, setProjectId] = useState(0)
    const [showSidebar, setShowSidebar] = useState(false)
    const [sorting, setSorting] = React.useState<SortingState>([{id: 'assessors_count', desc: true}, {id: 'status', desc: false}])
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: data ? data : [],
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
    if (isLoading) {
        return <Loader width={"16"}/>
    }

    return (
        <div className="pt-20 items-center pb-6">
            <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                <ProjectForm projectId={projectsId}
                             closeSidebar={setShowSidebar}/>
            </Dialog>
            <div className="h-full w-full px-8">

                <div className="flex-col items-center">
                    <div className="flex justify-between my-2">
                        <div className='my-auto'>
                            <p>Всего активных проектов: {data?.length}</p>
                        </div>
                        <MyButton onClick={() => {
                            setProjectId(0)
                            setShowSidebar(true)
                        }}>Добавить проект
                        </MyButton>
                    </div>
                    <Table pages={true} rowSelection={rowSelection} table={table}/>
                </div>
            </div>
        </div>
    );
};

export default PersonalAccountTable;