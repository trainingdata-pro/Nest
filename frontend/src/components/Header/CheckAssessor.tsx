import React, {useState} from 'react';
import MyInput from "../UI/MyInput";
import {useForm} from "react-hook-form";
import MyButton from "../UI/MyButton";
import Error from "../UI/Error";
import AssessorService from "../../services/AssessorService";
import {errorNotification} from "../UI/Notify";
import Table from "../UI/Table";
import TableCheckBox from "../UI/TableCheckBox";
import {
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel, getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Assessor} from "../../models/AssessorResponse";

interface FormProps{
    last_name: string,
    first_name: string,
    middle_name: string
}
const stateObject = {
    "available": "Доступен",
    "busy": "Занят",
    "free_resource": "Свободный ресурс",
    "vacation": "Отпуск",
    "blacklist": "Черный список",
    "fired": "Уволен",
}
const CheckAssessor = ({setIsOpenCheck}: {
    setIsOpenCheck: React.Dispatch<boolean>
}) => {
    const columnHelper = createColumnHelper<Assessor>()

    const {register,getValues, formState:{
        errors
    }, handleSubmit} = useForm<FormProps>()
    const columns = [
        columnHelper.accessor('last_name', {
            header: 'Фамилия',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('first_name', {
            cell: info => info.getValue(),
            header: 'Имя',
            enableSorting: false
        }),
        columnHelper.accessor('middle_name', {
            header: 'Отчество',
            cell: info =>info.getValue(),
            enableSorting: false
        }),
        columnHelper.accessor('username', {
            header: 'Ник в ТГ',
            cell: info => info.renderValue(),
            enableSorting: false
        }),
        columnHelper.accessor('projects', {
            header: 'Проект',
            cell: info => info.row.original.projects?.map(project => project.name).join(', '),
            enableSorting: false
        }),
        columnHelper.accessor('state', {
            header: 'Состояние',
            cell: info => stateObject[info.row.original.state],
            enableSorting: false
        }),
    ]
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [data, setData] = useState([])
    const table = useReactTable({
        data: data? data:[],
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
    const submit = () => {
        const {last_name, first_name, middle_name} = getValues()
        if (middle_name){
            AssessorService.checkAssessor(last_name, first_name, middle_name).then(res => setData(res.data.results)).catch(() => {
                errorNotification('Заполните все поля')
            })
        } else {
            AssessorService.checkAssessorWithoutMiddleName(last_name, first_name).then(res => setData(res.data.results)).catch(() => {
                errorNotification('Ошибка')
            })
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit(submit)}>
                <section className="flex justify-between my-2 space-x-2 box-border">
                    <div>
                        <MyInput register={{...register('last_name')}} type="text"
                                 name="last_name"
                                 placeholder="Фамилия"/>

                        <Error>{errors.last_name && errors.last_name?.message}</Error>
                    </div>
                    <div>
                        <MyInput
                            register={{...register('first_name')}}
                            type="text"
                            name="first_name"
                            placeholder="Имя"/>
                        <Error>{errors.first_name && errors.first_name?.message}</Error>
                    </div>
                    <div>

                        <MyInput
                            register={{...register('middle_name')}}
                            type="text"
                            name="middle_name"
                            placeholder="Отчество"/>
                        <Error>{errors.middle_name && errors.middle_name?.message}</Error>
                    </div>
                </section>
                <MyButton>Проверить</MyButton>
                <div>
                    {data.length === 0 ? 'Совпадений не найдено':<Table pages={true} rowSelection={rowSelection} table={table}/>}
                </div>
            </form>
        </div>
    );
};

export default CheckAssessor;