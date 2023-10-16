import {useQuery} from "react-query";
import AssessorService from "../../../services/AssessorService";
import MiniLoader from "../../UI/MiniLoader";
import React from "react";

const LastProject = ({assessorId}: {
    assessorId: string | number
}) => {
    const assessorHistoryProject = useQuery(['assessorHistoryProject', assessorId], () => AssessorService.fetchAssessorHistory(assessorId, 'project'), {})
    if (assessorHistoryProject.isLoading) return <MiniLoader size={6}/>
    return(<span>{assessorHistoryProject.data?.results[0]?.old_value ? assessorHistoryProject.data?.results[0]?.old_value: assessorHistoryProject.data?.results[0]?.new_value}</span>)
}

export default LastProject