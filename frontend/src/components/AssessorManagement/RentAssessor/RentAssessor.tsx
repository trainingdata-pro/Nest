import React from 'react';
import {errorNotification} from "../../UI/Notify";
import Table from "../../UI/Table";
import {getCoreRowModel, getPaginationRowModel, RowSelectionState, useReactTable} from "@tanstack/react-table";
import MyButton from "../../UI/MyButton";
import { columns } from './columns';
import {useGetProjects, useRentAssessor} from "./queries";


const RentAssessor = ({assessorId, show}:{
    assessorId: string | number,
    show: React.Dispatch<boolean>
}) => {
    const getSelectedProject = () => {
        return table.getPreFilteredRowModel().rows.at(Number(Object.keys(rowSelection)[0]))?.original.id
    }
    const {data} = useGetProjects()
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({} as RowSelectionState)
    const table = useReactTable({
        data: data ? data : [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        enableMultiRowSelection: false,
        onRowSelectionChange: setRowSelection,
        debugTable: false,
    })

    const {mutate} = useRentAssessor({assessorId:assessorId, show:show, project:getSelectedProject()})

    const submit = () => {
        if (Object.keys(rowSelection).length !== 0){
            mutate()
        } else {
            errorNotification('Выберите проект')
        }
    }
    return (
        <div>
                <h1 className='px-4 border-b border-black mb-2'>Аренда ассессора</h1>
                <Table table={table}/>
                <div className='flex justify-between space-x-2'>
                    <MyButton onClick={() => show(false)}>Назад</MyButton>
                    <MyButton onClick={submit}>Сохранить</MyButton>
                </div>
        </div>
    );
};

export default RentAssessor;