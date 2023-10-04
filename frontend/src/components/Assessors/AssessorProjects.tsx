import React, {useEffect, useMemo, useState} from 'react';
import Table from "../UI/Table";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import {Project} from "../../models/ProjectResponse";
import AssessorService from "../../services/AssessorService";
import ProjectService from "../../services/ProjectService";
import {IAssessorProjects} from "../../models/AssessorResponse";
import AssessorProjectRow from "./AssessorProjectRow";

const AssessorProjects = ({assessorId}: { assessorId: string | number | undefined }) => {

    // useMemo(async () => {
    //     if (assessorId) {
    //         const projectsResponse = await ProjectService.fetchProjectsByAssessorID(assessorId)
    //             .then(res => {
    //                 return res.data.results
    //             })
    //         const workloadStatus = await AssessorService.fetchWorkloadStatus(assessorId)
    //             .then(res => {
    //                 return res.data.results
    //             })
    //         const WorkingHours = await AssessorService.fetchWorkingHours(assessorId)
    //             .then(res => {
    //                 return res.data.results
    //             })
    //         let data:IAssessorProjects[] = []
    //         projectsResponse.map(project => {
    //             const workingHoursForProject = WorkingHours.filter(wh => project.id === wh.project.id)[0]
    //             const workloadStatusForProject = workloadStatus.filter(ws => project.id === ws.project.id)[0]
    //
    //             data = [...data, {
    //                 ...project,
    //                 workingHours: {...workingHoursForProject},
    //                 workloadStatus: {...workloadStatusForProject}
    //             }]
    //         })
    //         setProjects(data)
    //     }
    // }, [])

    const [projects, setProjects] = useState<IAssessorProjects[]>([])
    return (
        <table className="min-w-full text-center">
            <thead className="bg-[#E7EAFF]">
            <tr className="">
                <th className="border-r dark:border-neutral-500 px-[5px] py-[10px]" rowSpan={2}>Название проекта</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[10px]" rowSpan={2}>Менеджер проекта</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[10px]" rowSpan={2}>Статус</th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[10px]" colSpan={7}>Количество рабочих
                    часов
                </th>
                <th className="border-r dark:border-neutral-500 px-[5px] py-[10px]" rowSpan={2}>Всего</th>
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
            {projects.map(project =>
                <AssessorProjectRow key={project.id} project={project} assessorId={assessorId}/>)}
            </tbody>
        </table>
    );
};

export default AssessorProjects;