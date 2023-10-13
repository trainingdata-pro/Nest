import React from 'react';
import { useQuery } from 'react-query';
import {Assessor} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import {useNavigate} from "react-router-dom";
import MiniLoader from "../UI/MiniLoader";
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
    const assessor = useQuery(['assessorProject', assessorId], async () => await AssessorService.fetchAssessor(assessorId))
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
    return (!assessor.isLoading &&  !workload.isLoading && !workingHours.isLoading?
            <tr>
                <Cell>
                    <input onChange={selectAssessor} type="checkbox"/>
                </Cell>
                <Cell cls='cursor-pointer' onClick={() => navigate(`/assessor/${assessorId}/`)}>{assessor.data?.last_name}</Cell>
                <Cell cls='cursor-pointer' onClick={() => navigate(`/assessor/${assessorId}/`)}>{assessor.data?.first_name}</Cell>
                <Cell cls='cursor-pointer' onClick={() => navigate(`/assessor/${assessorId}/`)}>{assessor.data?.middle_name}</Cell>
                <Cell>{assessor.data?.username}</Cell>
                <Cell>{workingHours.data?.monday ? workingHours.data?.monday : 0}</Cell>
                <Cell>{workingHours.data?.tuesday ? workingHours.data?.tuesday : 0}</Cell>
                <Cell>{workingHours.data?.wednesday ? workingHours.data?.wednesday : 0}</Cell>
                <Cell>{workingHours.data?.thursday ? workingHours.data?.thursday : 0}</Cell>
                <Cell>{workingHours.data?.friday ? workingHours.data?.friday : 0}</Cell>
                <Cell>{workingHours.data?.saturday ? workingHours.data?.saturday : 0}</Cell>
                <Cell>{workingHours.data?.sunday ? workingHours.data?.sunday : 0}</Cell>
                <Cell>{workingHours.data?.total ? workingHours.data?.total : 0}</Cell>
                <Cell>{
                    // @ts-ignore
                    statusObject[workload.data?.status]
                }</Cell>
                <Cell>{assessor.data?.skills.map(skill => skill.title).join(', ')}</Cell>

            </tr> : <tr>
                <Cell>
                    <MiniLoader size={6}/>
                </Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
                <Cell><MiniLoader size={6}/></Cell>
            <Cell><MiniLoader size={6}/></Cell></tr>
    );
};

export default AssessorsPageRow;