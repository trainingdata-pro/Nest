import React, {useContext, useState} from 'react';
import Header from "../components/Header/Header";
import ProjectService from "../services/ProjectService";
import {Context} from "../index";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import {useMutation, useQuery} from "react-query";
import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Project} from "../models/ProjectResponse";
import Table from "../components/UI/Table";
import MyButton from "../components/UI/MyButton";
import {successNotification, warnNotification} from "../components/UI/Notify";
import {observer} from "mobx-react-lite";
import fileDownload from 'js-file-download'
import Dialog from "../components/UI/Dialog";
import Export from "../components/Projects/Export";
const CompletedProjects = () => {
    const columnHelper = createColumnHelper<Project>()
    const {store} = useContext(Context)

    const columns = [
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
        columnHelper.accessor('manager', {
            header: 'Менеджер',
            cell: info => info.getValue().map(manager => {
                return `${manager.last_name} ${manager.first_name}`
            }),
            enableSorting: false
        }),
        columnHelper.accessor('assessors_count', {
            header: 'Количество ассессеров',
            cell: info => info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('date_of_creation', {
            header: 'Дата начала',
            cell: info => info.getValue(),
            enableSorting: true
        }),
        columnHelper.accessor('date_of_completion', {
            header: 'Дата завершения',
            cell: info => info.getValue(),
            enableSorting: true
        }),
        columnHelper.accessor('id', {
            header: '',
            cell: () => <button className='disabled:opacity-50 disabled:cursor-default'
                                  disabled={!store.user_data.is_teamlead}><PencilSquareIcon
                className="h-6 w-6 text-gray-500"/></button>,
            enableSorting: false,
            size:40
        }),
    ]
    async function fetchAllData() {
        const allData = [];
        let currentPage = 1;
        let hasMoreData = true;
        while (hasMoreData) {
            const data = await ProjectService.fetchCompletedProjects(currentPage);
            allData.push(...data.results);
            if (data.next !== null) {
                currentPage++;
            } else {
                hasMoreData = false;
            }
        }
        return allData;
    }
    const [sorting, setSorting] = React.useState<SortingState>([{id: 'date_of_completion', desc: true}])
    const [rowSelection, setRowSelection] = React.useState({})
    const {data} = useQuery(['completedProjects'], () => fetchAllData())

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
    const [isExportProjects, setIsExportProjects] = useState(false)

    return (
        <div>
            <Header/>
            <Dialog isOpen={isExportProjects} setIsOpen={setIsExportProjects}>
                <Export setIsExportProjects={setIsExportProjects} exportType='completedProjects' project={undefined}/>
            </Dialog>
            <div className="pt-20 px-8">
                <div className='my-2 flex justify-end'>
                    <MyButton onClick={() => setIsExportProjects(true)}>Экспорт</MyButton>
                </div>
                <Table pages={true} rowSelection={rowSelection} table={table}/>
            </div>
        </div>
    );
};

export default observer(CompletedProjects);