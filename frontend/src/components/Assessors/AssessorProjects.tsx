import React, {useEffect, useState} from 'react';
import Table from "../UI/Table";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import {Project} from "../../models/ProjectResponse";
import AssessorService from "../../services/AssessorService";
import ProjectService from "../../services/ProjectService";

const AssessorProjects = ({assessorId}: { assessorId: string | number | undefined }) => {
    const [data, setData] = useState<Project[]>([])
    useEffect(()=> {
        if (assessorId){
            ProjectService.fetchProjectsByAssessorID(assessorId).then(res => console.log(res.data))
            AssessorService.fetchWorkloadStatus(assessorId).then(res => console.log(res.data))
            AssessorService.fetchWorkingHours(assessorId).then(res => console.log(res.data))
        }

    }, [])
    return (
        <table className="min-w-full text-center">
            <thead className="">
            <tr className="bg-[#E7EAFF]">
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Название проекта</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Менеджер проекта</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Статус</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Количество рабочих часов</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]">Всего</th>
            </tr>
            </thead>
            <tbody>

            </tbody>
            {/*{data.length !== 0 ? <tbody> {data.map(project => <tr key={project.id} className="text-center border-t dark:border-neutral-500">*/}
            {/*    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.asana_id}</td>*/}
            {/*    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.name}</td>*/}
            {/*    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.manager.map(manager => <span key={manager.id}>{manager.last_name} {manager.first_name}</span>)}</td>*/}
            {/*    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px] cursor-pointer" onClick={() => navigation(`/dashboard/projects/${project.id}/assessors`)}>{project.assessors_count}</td>*/}
            {/*    <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{statusObject[project.status]}</td>*/}
            {/*    <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">*/}
            {/*        <PencilSquareIcon className="cursor-pointer h-6 w-6 text-gray-500" onClick={() => {*/}
            {/*            setProjectId(project.id)*/}
            {/*            setShowSidebar(true)*/}
            {/*        }}/>*/}
            {/*    </td>*/}
            {/*</tr>) }</tbody>: <tbody>*/}
            {/*<tr>*/}
            {/*    <td className="p-4 border-b align-middle [&amp;:has([role=checkbox])]:pr-0 h-24 text-center"*/}
            {/*        colSpan={20}>Нет результатов*/}
            {/*    </td>*/}
            {/*</tr>*/}
            {/*</tbody>}*/}

        </table>
    );
};

export default AssessorProjects;