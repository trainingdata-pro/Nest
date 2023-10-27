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
import FreeResourceEdit from "../FreeResource/FreeResorces/FreeResourceEdit";
import CheckAssessorManagement from "./CheckAssessorManagement";

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
interface CheckAssessor extends Assessor{
    last_manager: string,
    last_project: string
}
const CheckAssessor = ({setIsOpenCheck}: {
    setIsOpenCheck: React.Dispatch<boolean>
}) => {
    const columnHelper = createColumnHelper<CheckAssessor>()

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
            cell: info => {
                if (info.row.original.last_project){
                    return info.row.original.last_project
                } else {
                    return info.row.original.projects?.map(project => project.name).join(', ')
                }
            },
            enableSorting: false
        }),
        columnHelper.accessor('manager', {
            header: 'Менеджер',
            cell: info => {
                if (info.row.original.last_manager){
                    return info.row.original.last_manager
                } else if (info.row.original.manager) {
                    return `${info.row.original.manager.last_name} ${info.row.original.manager.first_name}`
                } else {
                    return ''
                }

            },
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
    const [showTable, setShowTable] = useState(false)
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
        setShowTable(true)
    }
    return (
        <div className='max-w-[800px] overflow-x-hidden'>
            <form onSubmit={handleSubmit(submit)}>
                <section className="flex justify-between my-2 space-x-2 box-border">
                    <div className={'w-full'}>
                        <MyInput register={{...register('last_name')}}
                                 type="text"
                                 name="last_name"
                                 placeholder="Фамилия"/>

                        <Error>{errors.last_name && errors.last_name?.message}</Error>
                    </div>
                    <div className={'w-full'}>
                        <MyInput
                            register={{...register('first_name')}}
                            type="text"
                            name="first_name"
                            placeholder="Имя"/>
                        <Error>{errors.first_name && errors.first_name?.message}</Error>
                    </div>
                    <div className={'w-full'}>

                        <MyInput
                            register={{...register('middle_name')}}
                            type="text"
                            name="middle_name"
                            placeholder="Отчество"/>
                        <Error>{errors.middle_name && errors.middle_name?.message}</Error>
                    </div>
                    <MyButton>Проверить</MyButton>
                </section>
            </form>
            <div>
                {showTable && (data.length === 0 ? 'Совпадений не найдено':<Table table={table}/>)}
            </div>
        </div>
    );
};

export default CheckAssessor;