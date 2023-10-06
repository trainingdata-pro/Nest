import React, {useEffect, useMemo, useState} from 'react';
import Table from "../UI/Table";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import {Project} from "../../models/ProjectResponse";
import AssessorService from "../../services/AssessorService";
import ProjectService from "../../services/ProjectService";
import {IAssessorProjects} from "../../models/AssessorResponse";
import AssessorProjectRow from "./AssessorProjectRow";
import {useQuery} from "react-query";

const AssessorProjects = ({assessorId}: { assessorId: string | number | undefined }) => {
    const projects = useQuery(['assessorProjects', assessorId], () => ProjectService.fetchProjectsByAssessorID(assessorId))

    if (projects.isSuccess){
        return (
            <table className="min-w-full text-center">
                <thead className="bg-[#E7EAFF]">
                <tr className="">
                    <th className="border-r dark:border-neutral-500 py-[3px]" rowSpan={2}>Название проекта</th>
                    <th className="border-r dark:border-neutral-500 py-[3px]" rowSpan={2}>Менеджер проекта</th>
                    <th className="border-r dark:border-neutral-500 py-[3px]" rowSpan={2}>Статус</th>
                    <th className="border-r dark:border-neutral-500 py-[3px]" colSpan={7}>Количество рабочих
                        часов
                    </th>
                    <th className="border-r dark:border-neutral-500 py-[3px]" rowSpan={2}>Всего</th>
                    <th className='px-[5px] py-[10px]' rowSpan={2}></th>
                </tr>
                <tr>
                    <th className="border-r dark:border-neutral-500">ПН</th>
                    <th className="border-r dark:border-neutral-500">ВТ</th>
                    <th className="border-r dark:border-neutral-500">СР</th>
                    <th className="border-r dark:border-neutral-500">ЧТ</th>
                    <th className="border-r dark:border-neutral-500">ПТ</th>
                    <th className="border-r dark:border-neutral-500">СБ</th>
                    <th className="border-r dark:border-neutral-500">ВС</th>
                </tr>
                </thead>
                <tbody className='bg-white'>
                {projects.data.results.length !== 0 ? projects.data.results.map(project =>
                    <AssessorProjectRow key={project.id} project={project} assessorId={assessorId}/>) : <tr><td colSpan={20}>Данные не найдены</td></tr>}
                </tbody>
            </table>
        );
    } else {
        return <div>ffff</div>
    }

};

export default AssessorProjects;