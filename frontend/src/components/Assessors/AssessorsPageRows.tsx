import React from 'react';
import { useQuery } from 'react-query';
import {Assessor} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import {useNavigate} from "react-router-dom";
interface Cell extends React.ButtonHTMLAttributes<HTMLTableDataCellElement> {
    cls?: string
}
const Cell = ({children,cls, onClick}: Cell) => {
    return <td onClick={onClick} className={`text-center py-2 ${cls}`}>{children}</td>
}
const AssessorsPageRow = ({assessorId, projectId, setSelectedAssessors, selectedAssessors,assessorsProjects,setAssessorProjects}:{
    setSelectedAssessors: any
    assessorId: string|number,
    projectId: string|number|undefined,
    selectedAssessors: number[],
    assessorsProjects:any,
    setAssessorProjects: any
}) => {
    const statusObject = {
        "full":"Полная загрузка",
        "partial": "Частичная загрузка",
        "reserved": "Зарезервирован",
    }
    const assessor = useQuery(['assessorProject', assessorId], () => AssessorService.fetchAssessor(assessorId))
    const workload = useQuery(['workload', projectId, assessorId], () => AssessorService.fetchWorkloadStatus(assessorId,projectId),{
        select: (data) => data?.results[0]
    })
    const workingHours = useQuery(['workingHours', projectId, assessorId], () => AssessorService.fetchWorkingHours(assessorId,projectId),{
        select: (data) => data?.results[0]
    })
    const navigate = useNavigate()
    const selectAssessor = (event:any)=> {
        if (event.target.checked){
            setSelectedAssessors([...selectedAssessors, assessorId])
            setAssessorProjects({...assessorsProjects, [assessorId]: assessor.data?.projects.map(project => project.id)})

        } else{
            setSelectedAssessors(selectedAssessors.filter(id => id !== assessorId))
            delete assessorsProjects[assessorId]
            setAssessorProjects(assessorsProjects)

        }
    }
    return (
            <tr>
                <Cell>
                    <input onChange={selectAssessor} type="checkbox"/>
                </Cell>
                <Cell cls='cursor-pointer' onClick={() => navigate(`/assessor/${assessorId}/`)}>{assessor.data?.last_name}</Cell>
                <Cell cls='cursor-pointer' onClick={() => navigate(`/assessor/${assessorId}/`)}>{assessor.data?.first_name}</Cell>
                <Cell cls='cursor-pointer' onClick={() => navigate(`/assessor/${assessorId}/`)}>{assessor.data?.middle_name}</Cell>
                <Cell>{assessor.data?.username}</Cell>
                <Cell>{workingHours.data?.monday}</Cell>
                <Cell>{workingHours.data?.tuesday}</Cell>
                <Cell>{workingHours.data?.wednesday}</Cell>
                <Cell>{workingHours.data?.thursday}</Cell>
                <Cell>{workingHours.data?.friday}</Cell>
                <Cell>{workingHours.data?.saturday}</Cell>
                <Cell>{workingHours.data?.sunday}</Cell>
                <Cell>{workingHours.data?.total}</Cell>
                <Cell>{
                    // @ts-ignore
                    statusObject[workload.data?.status]
                }</Cell>

            </tr>
    );
};

export default AssessorsPageRow;