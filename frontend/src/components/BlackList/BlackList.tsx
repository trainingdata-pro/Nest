import React, {useEffect, useMemo, useState} from 'react';
import AssessorService from "../../services/AssessorService";
import {ColumnDef} from "@tanstack/react-table";
import {Project} from "../../models/ProjectResponse";
import Table from "../UI/Table";
import {Assessor} from "../../models/AssessorResponse";
type TReason = {
    id: number,
    title: string,
    blacklist_reason: boolean
}
type TBlackList = {
    id: number,
    date: string,
    reason: TReason,
    assessor: Assessor

}
const BlackList = () => {
    const columns = useMemo<ColumnDef<TBlackList>[]>(() => {
        return [

            {
                accessorKey: 'assessor.last_name',
                header: 'Фамилия',
                cell: info => info.getValue(),
                size: 200,
            },
            {
                accessorKey: 'assessor.first_name',
                header: 'Имя',
                cell: info => info.getValue(),
                size: 200,
            },
            {
                accessorKey: 'assessor.middle_name',
                header: 'Отчество',
                cell: info => info.getValue(),
                size: 200,
            },
            {
                accessorKey: 'assessor.username',
                header: 'Ник в ТГ',
                cell: info => info.getValue(),
                size: 200,
            },
            {
                accessorKey: 'assessor.manager',
                header: 'Руководитель',
                cell: info => <div>{info.row.original.assessor.last_name} {info.row.original.assessor.first_name}</div>,
                size: 200,
            },
        ];
    }, [])
    const [data, setData] = useState([])
    useEffect(() => {
        AssessorService.getBlackList().then(res => setData(res.data.results))
    }, []);
    return (
        <div>
            <Table data={data} columns={columns} pages={true}/>
        </div>
    );
};

export default BlackList;