import React, {useEffect, useState} from 'react';
import AssessorService from "../../services/AssessorService";
import {useQuery} from "react-query";


type THistory = {
    action: string,
    attribute: string,
    id: number,
    new_value: string,
    old_value: string,
    reason: string,
    timestamp: string,
    user: string
}
const AssessorHistory = ({assessorId}: {
    assessorId: number | string | undefined
}) => {

    const userId = 1
    const {data} = useQuery(['assessorHistory', assessorId], () => AssessorService.fetchAssessorHistory(assessorId, 'state'), {
        onSuccess: data1 => console.log(data1)
    })
    return (
        <div>
            {data?.results[0].id}
        </div>
    );
};

export default AssessorHistory;