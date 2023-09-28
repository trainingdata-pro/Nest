import React, {useEffect, useState} from 'react';
import Table from "../UI/Table";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import {Project} from "../../models/ProjectResponse";
import AssessorService from "../../services/AssessorService";
import ProjectService from "../../services/ProjectService";

const AssessorProjects = ({assessorId}: { assessorId: string | number | undefined }) => {

    useEffect(() => {
        if (assessorId) {
            ProjectService.fetchProjectsByAssessorID(assessorId).then(res => setProjects(res.data.results))
            AssessorService.fetchWorkloadStatus(assessorId).then(res => setWorkload(res.data.results))
            AssessorService.fetchWorkingHours(assessorId).then(res => {
                setWorkingHours(res.data.results)
                console.log(res.data.results)
            })
        }
    }, [])

    function getCurrentWorkingHours(projectId: string | number, workingHours: any[]) {
        return workingHours.filter(workingHours => workingHours.project.id === projectId)[0]
    }

    const [projects, setProjects] = useState<Project[]>([])
    const [workload, setWorkload] = useState<any>([])
    const [workingHours, setWorkingHours] = useState<any>([])
    return (
        <table className="min-w-full text-center">
            <thead className="bg-[#E7EAFF]">
            <tr className="">
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]" rowSpan={2}>Название проекта</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]" rowSpan={2}>Менеджер проекта</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]" rowSpan={2}>Статус</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]" colSpan={7}>Количество рабочих
                    часов
                </th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[20px]" rowSpan={2}>Всего</th>
            </tr>
            <tr>
                <th>ПН</th>
                <th>ВТ</th>
                <th>СР</th>
                <th>ЧТ</th>
                <th>ПТ</th>
                <th>СБ</th>
                <th>ВС</th>
            </tr>
            </thead>
            <tbody>
            {projects.map(project => <tr key={project.id}>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.name}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.manager[0].last_name}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{workload.filter((workload: any) => workload.project.id === project.id)[0]?.status}</td>
                {Object.keys(getCurrentWorkingHours(project.id, workingHours)).filter(wh => wh !== 'project' && wh !== 'assessor' && wh !== 'id' && wh !== 'total').map((key, index) =>
                    <td key={index} className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">
                        {workingHours.filter((workingHours: any) => workingHours.project.id === project.id)[0][key]}
                    </td>)}
                <td className="whitespace-nowrap px-[5px] py-[20px]">
                    {workingHours.filter((workingHours: any) => workingHours.project.id === project.id)[0]?.total}
                </td>
            </tr>)}
            </tbody>
        </table>
    );
};

export default AssessorProjects;