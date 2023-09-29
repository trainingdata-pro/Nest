import React, {useEffect, useState} from 'react';
import AssessorService from "../../services/AssessorService";


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

    useEffect(()=>{
        if (assessorId){
            AssessorService.fetchAssessorHistory(assessorId).then(res => setHistory(res.data.results.reverse()))
        }
    }, [assessorId])
    const [history, setHistory] = useState<THistory[]>([])
    return (
        <div>
            {history.map(row => <div>{row.id}</div>)}
        </div>
    );
};

export default AssessorHistory;