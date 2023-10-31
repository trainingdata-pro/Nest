import React, {useState} from 'react';
import MyInput from "../UI/MyInput";
import {useForm} from "react-hook-form";
import MyButton from "../UI/MyButton";
import Error from "../UI/Error";
import AssessorService, {ICheckAssessor} from "../../services/AssessorService";
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
import {useMutation, useQuery} from "react-query";
import TablePagination from "../UI/TablePagination";
import FreeResourceEdit from "../FreeResource/FreeResorces/FreeResourceEdit";
import Dialog from "../UI/Dialog";
import AssessorHistory from "../Assessors/AssessorPage/AssessorHistory";
import {Project} from "../../models/ProjectResponse";
import {Manager} from "../../services/ManagerService";
import {IUser} from "../../models/ManagerResponse";

interface FormProps{
    name: string,
}
const stateObject = {
    "available": "Доступен",
    "busy": "Занят",
    "free_resource": "Свободный ресурс",
    "vacation": "Отпуск",
    "blacklist": "Черный список",
    "fired": "Уволен",
}

const CheckAssessor = () => {
    const columnHelper = createColumnHelper<ICheckAssessor>()
    const [name, setName] = useState<string>('')
    const [isShowHistory, setIsShowHistory] = useState(false)
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
        columnHelper.display( {
            id: 'assessorId',
            header: '',
            cell: info => <>
                <Dialog topLayer={true} isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                    <AssessorHistory assessorId={info.row.original.pk}/>
                </Dialog>
                <div className='cursor-pointer' onClick={() => setIsShowHistory(true)}>История</div>
            </>,
            enableSorting:false
        })
    ]

    const [data, setData] = useState<any>([])
    const table = useReactTable({
        data: data? data:[],
        columns,
        getCoreRowModel: getCoreRowModel(),
        debugTable: false,
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const checkAssessors = useQuery(['checkAssessor', currentPage, name], () => AssessorService.checkAssessor(currentPage, name), {
        enabled: name.length >= 3,
        keepPreviousData:true,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / 10))
            setData([...data1.results])
        }
    })

    return (
        <div className='w-[800px]'>

                <section className="flex justify-between my-2 space-x-2">
                    <div className={'w-full'}>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className='py-[12px] bg-[#F4F8F7] rounded-[8px] w-full text-left disabled:opacity-50 pl-[15px]'
                            type="text"
                            name="name"
                            placeholder="Поиск по ФИО/Ник в ТГ"/>
                        {name.length <3 && <p className='flex justify-start my-[5px]'>Минимальная длина запроса 3 символа</p>}

                    </div>
                </section>
            <div>
                {checkAssessors.isLoading ? 'Загрузка...' :
                    <>
                    <Table table={table}/>
                    <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage}/>
                    </>
            }
            </div>
        </div>
    );
};

export default CheckAssessor;