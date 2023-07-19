import Header from "../components/Header/Header";
import React, {useContext, useEffect, useMemo, useState} from "react";
import AssessorTable from "../components/Table/AssessorsTable";
import AssessorsService from "../services/AssessorsService";
import AddAssessor from "../components/AddAssessor";
import {observer} from "mobx-react-lite";
import {ColumnDef} from "@tanstack/react-table";
import {IndeterminateCheckbox} from "../utils/checkBox";
import Owner from "../components/Table/Owner";
import DropdownMenu from "../components/ui/DropDownMenu";
import {Context} from "../index";
import {IManager} from "../models/ManagerResponse";
import {IAssessor} from "../models/AssessorResponse";
import DropdownMenuAssessors from "../components/ui/DropDownMenuAssessors";


const TeamPage = () => {
    const {store} = useContext(Context)
    const columns = useMemo<ColumnDef<IAssessor>[]>(() => [
            {
                id: 'select',
                header: '',
                cell: ({row}) => (
                    <IndeterminateCheckbox key={row.id}
                                           {...{
                                               checked: row.getIsSelected(),
                                               disabled: !row.getCanSelect(),
                                               indeterminate: row.getIsSomeSelected(),
                                               onChange: row.getToggleSelectedHandler(),
                                           }}
                    />
                ),
                size: 10,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'id',
                header: 'id',
                cell: info => info.getValue(),
                size: 100,
                enableSorting: false,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'last_name',
                header: 'Фамилия',
                cell: info => info.getValue(),
                size: 400,

            },
            {
                accessorKey: 'first_name',
                header: 'Имя',
                cell: info => info.getValue(),
                enableSorting: false,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'middle_name',
                header: 'Отчество',
                cell: info => info.getValue(),
                enableSorting: false,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'username',
                header: 'Телеграм',
                cell: info => info.getValue(),
                enableSorting: true,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'projects',
                header: 'Проекты',
                cell: (cell) => {
                    // @ts-ignore
                    return (<ul>{cell.getValue().map((project: any, index: any) => (
                                <li key={index}>{project.name}</li>
                            ))}
                        </ul>
                    )
                },
                enableSorting: true,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'is_busy',
                header: 'Статус',
                cell: info => info.getValue() ? 'Занят' : 'Свободен',
                enableSorting: true,
                enableGlobalFilter: false
            },
            {
                accessorKey: 'id',
                id: "check",
                header: '',
                // @ts-ignore
                cell: ({row}) =>
                    <DropdownMenuAssessors id={row._valuesCache}/>

                ,
                enableSorting: false,
                enableGlobalFilter: false
            }

        ],
        [])
    const [data, setData] = useState([])
    useMemo(() => {
        store.fetchAssessors()
    },[])
    useEffect(()=>{
        // @ts-ignore
        setData(store.assessors)
    },[store.assessors])
    const [visible, setVisible] = useState(false)
    return (<>
            <Header name="Добавить исполнителя" setVisible={setVisible}></Header>
            {visible && <AddAssessor setVisible={setVisible}/>}
            <AssessorTable data={data} columns={columns}/>

        </>
    )
};

export default observer(TeamPage);