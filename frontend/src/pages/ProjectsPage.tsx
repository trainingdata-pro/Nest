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
        // is_operational_manager: boolean,
        // operational_manager: number
    }
}

const ProjectsPage = () => {
    const {store} = useContext(Context)
    const columns = useMemo<ColumnDef<Project>[]>(() => [
        {
            id: 'select',
            header: '',
            cell: ({row}) => (
                <div className="px-1">
                    <IndeterminateCheckbox key={row.id}
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
            minSize: 50,
            maxSize: 5,
        },
        {
            accessorKey: 'id',
            header: 'id',
            cell: info => info.getValue(),
            minSize: 20,
            maxSize: 20,
            enableSorting: false
        },
        {
            accessorKey: 'name',
            header: 'Название проекта',
            cell: info => info.getValue()
        },
        {
            accessorKey: 'owner.user.username',
            header: 'Владелец',
            cell: info => info.getValue(),
            enableSorting: false
        },
        {
            accessorKey: 'id',
            id:"check",
            header: '',
            // @ts-ignore
            cell:info =>
                <DropdownMenu id={info.getValue()}/>
            ,
            enableSorting: false
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

    return (
        <>
            <Header name="Добавить проект" children={<AddProject/>}></Header>
            <ProjectTable data={data} columns={columns}/>
        </>
    )


};

export default observer(ProjectsPage);