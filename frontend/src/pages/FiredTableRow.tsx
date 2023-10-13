import React from 'react';
import {useQuery} from "react-query";
import AssessorService from "../services/AssessorService";
import {IFired} from "../models/AssessorResponse";

const FiredTableRow = ({assessor}:{
    assessor:IFired
}) => {
    const assessorHistoryManager = useQuery(['assessorHistoryManager', assessor.assessor.id], () => AssessorService.fetchAssessorHistory(assessor.assessor.id,'manager'), {})
    const assessorHistoryProject = useQuery(['assessorHistoryProject', assessor.assessor.id], () => AssessorService.fetchAssessorHistory(assessor.assessor.id,'project'), {})
    return (
        <tr className="text-center border-t dark:border-neutral-500">
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.assessor.last_name}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.assessor.first_name}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.assessor.middle_name}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.assessor.username}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessorHistoryManager.data?.results[0]?.old_value}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessorHistoryProject.data?.results[0]?.old_value}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.reason.title}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.assessor.skills.map(skill => skill.title).join(', ')}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.date}</td>
            <td className="whitespace-nowrap break-all border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.possible_return_date}</td>
            <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">
                <button>История</button>
            </td>
        </tr>
    );
};

export default FiredTableRow;