import Header from "../components/Header/Header";
import AddProject from "../components/AddProject";
import ProjectTable from "../components/Table/ProjectsTable";
import {ColumnDef} from "@tanstack/react-table";
import React, {HTMLProps, useCallback, useContext, useEffect, useMemo, useState} from "react";
import ProjectsService from "../services/ProjectsService";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {IndeterminateCheckbox} from "../utils/checkBox";
import DropdownMenu from "../components/ui/DropDownMenu";
import Owner from "../components/Table/Owner";

interface Project {
    id: number
    name: string
    owner: {
        id: number,
        user: {
            id: number,
            username: string,
            email: string
        },
        last_name: string,
        first_name: string,
        middle_name: string,
    },
    date_of_create: string
}

const ProjectsPage = () => {
    const {store} = useContext(Context)
    const columns = useMemo<ColumnDef<Project>[]>(() => [
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
            enableGlobalFilter:false
        },
        {
            accessorKey: 'name',
            header: 'Название проекта',
            cell: info => info.getValue(),

        },
        {
            accessorKey: 'owner',
            header: 'Владелец',
            cell: info => <Owner manager={info.getValue()}/>,
            enableSorting: false,

        },
        {
            accessorKey: 'date_of_create',
            header: 'Дата создания',
            cell: info => info.getValue(),
            size:100,
            enableGlobalFilter: false

        },
        {
            accessorKey: 'id',
            id:"check",
            header: '',
            // @ts-ignore
            cell:info =>
                <DropdownMenu id={info.getValue()}/>
            ,
            enableSorting: false,
            enableGlobalFilter:false
        }

    ], [])
    const [data, setData] = useState([])

    useMemo(()=>{
        store.fetchProjects()
    },[])

    useEffect(()=>{
        // @ts-ignore
        setData(store.projects)
    },[store.projects])
    const [visible, setVisible] = useState(false)
    return (
        <>
            <Header name="Добавить проект" setVisible={setVisible}></Header>
            {visible && <AddProject setVisible={setVisible}/>}
            <ProjectTable data={data} columns={columns}/>
        </>
    )


};

export default observer(ProjectsPage);