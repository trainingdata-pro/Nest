import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import MiniLoader from "../../UI/MiniLoader";
import React from "react";

const LastManager = ({assessorId}: {
    assessorId: string | number
}) => {
    const assessorHistoryManager = useQuery(['assessorHistoryManager', assessorId], () => AssessorService.fetchAssessorHistory(assessorId, 'manager'), {})
    if (assessorHistoryManager.isLoading) return <MiniLoader size={6}/>
    return(<span className='w-full h-full text-center'>{assessorHistoryManager.data?.results[0]?.old_value ? assessorHistoryManager.data?.results[0]?.old_value: assessorHistoryManager.data?.results[0]?.new_value}</span>)
}

export default LastManager