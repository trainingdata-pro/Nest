import React, {useEffect, useMemo, useState} from 'react';
import Table from "../UI/Table";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import {Project} from "../../models/ProjectResponse";
import AssessorService from "../../services/AssessorService";
import ProjectService from "../../services/ProjectService";
import {IAssessorProjects} from "../../models/AssessorResponse";

const AssessorProjects = ({assessorId}: { assessorId: string | number | undefined }) => {

    useMemo(async () => {
        if (assessorId) {
            const projectsResponse = await ProjectService.fetchProjectsByAssessorID(assessorId).then(res => {return res.data.results})
            const workloadStatus = await AssessorService.fetchWorkloadStatus(assessorId).then(res => {return res.data.results})
            const WorkingHours = await AssessorService.fetchWorkingHours(assessorId).then(res => {return res.data.results})
            projectsResponse.map(project => {
                const workingHoursForProject = WorkingHours.filter(wh => project.id === wh.project.id)[0]
                const workloadStatusForProject = workloadStatus.filter(ws => project.id === ws.project.id)[0]
                setProjects([...projects, {
                    ...project,
                    workingHours: {...workingHoursForProject},
                    workloadStatus: {...workloadStatusForProject}
                }])
            })
        }
    }, [])

    function getCurrentWorkingHours(projectId: string | number, workingHours: any[]) {
        return workingHours.filter(workingHours => workingHours.project.id === projectId)[0]
    }

    const [projects, setProjects] = useState<IAssessorProjects[]>([])
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
                <th className="border-r dark:border-neutral-500">ПН</th>
                <th className="border-r dark:border-neutral-500">ВТ</th>
                <th className="border-r dark:border-neutral-500">СР</th>
                <th className="border-r dark:border-neutral-500">ЧТ</th>
                <th className="border-r dark:border-neutral-500">ПТ</th>
                <th className="border-r dark:border-neutral-500">СБ</th>
                <th className="border-r dark:border-neutral-500">ВС</th>
            </tr>
            </thead>
            <tbody>
            {projects.map(project => <tr key={project.id}>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.name}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.manager[0].last_name}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.workloadStatus.status}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.workingHours.monday}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.workingHours.tuesday}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.workingHours.wednesday}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.workingHours.thursday}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.workingHours.friday}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.workingHours.saturday}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.workingHours.sunday}</td>
                <td className="whitespace-nowrap px-[5px] py-[20px]">{project.workingHours.total}</td>
            </tr>)}
            </tbody>
        </table>
    );
};

export default AssessorProjects;