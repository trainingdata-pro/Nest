import React, {useContext} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";
import {errorNotification, successNotification} from "../UI/Notify";
import ProjectService from "../../services/ProjectService";
import {Context} from "../../index";
import Table from "../UI/Table";
import {createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {Project} from "../../models/ProjectResponse";
import TableCheckBox from "../UI/TableCheckBox";
import MyButton from "../UI/MyButton";


const RentAssessor = ({assessorId, show}:{
    assessorId: string | number,
    show: React.Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()
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
    const {store} = useContext(Context)
    const {
        data,
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

    const [rowSelection, setRowSelection] = React.useState({})
    const table = useReactTable({
        data: data ? data : [],
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
        })
    }
    const rentAssessor = useMutation(['assessors'], () => AssessorService.takeFromFreeResource(assessorId, {
        second_manager: store.user_id,
        projects: [...getSelectedProjects()]
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessors')
            queryClient.invalidateQueries('freeResources')
            successNotification('Ассессор успешно арендован')
        },
        onError: () => {
            errorNotification('Произошла ошибка')
        }
    })

    const submit = () => {
        if (Object.keys(rowSelection).length !== 0){
            rentAssessor.mutate()
        } else {
            errorNotification('Выберите хотя бы 1 проект')
        }

    }
    return (
        <div>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Аренда ассессора</h1>
                <Table pages={true} rowSelection={rowSelection} table={table}/>
                <div className='flex space-x-2'>
                    <MyButton onClick={() => show(false)}>Назад</MyButton>
                    <MyButton onClick={submit}>Сохранить</MyButton>
                </div>
            </div>
        </div>
    );
};

export default RentAssessor;