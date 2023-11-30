import React from 'react';
import {useQuery} from "react-query";
import AssessorProjectRow from "./AssessorProjectRow";
import ProjectService from "../../../../services/ProjectService";
import AssessorService from "../../../../services/AssessorService";
import {IUser} from "../../../../models/ManagerResponse";
import {WorkingHours, WorkloadStatus} from "../../../../models/AssessorResponse";
export interface AssessorRowProps{
    id: string|number,
    name: string,
    manager: IUser[],
    workloadStatus: WorkloadStatus | undefined,
    workingHours: WorkingHours | undefined
}
const AssessorProjects = ({assessorId}: { assessorId: string | number | undefined }) => {
    // const projects = useQuery(['assessorProjects', assessorId], () => ProjectService.fetchProjectsByAssessorID(assessorId))
    const projectsNew = useQuery(['assessorProjectsNew', assessorId], () => AssessorService.fetchAssessor(assessorId), {
        select: data => {
            let data1: AssessorRowProps[] = []
            data?.projects.map(project =>
                data1.push({
                    id: project.id,
                    name: project.name,
                    manager: project.manager,
                    workloadStatus: data.workload_status.find(status => status.project.id.toString() === project.id.toString()),
                    workingHours: data.working_hours.find(wh => wh.project.id.toString() === project.id.toString())
                })
            )
            return data1
        }
    })
    if (projectsNew.isSuccess){
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
                {projectsNew.data?.length !== 0 ? projectsNew.data?.map(project =>
                    <AssessorProjectRow key={project.id} project={project} assessorId={assessorId}/>) : <tr><td colSpan={20}>Данные не найдены</td></tr>}
                </tbody>
            </table>
        );
    } else {
        return <div></div>
    }

};

export default AssessorProjects;