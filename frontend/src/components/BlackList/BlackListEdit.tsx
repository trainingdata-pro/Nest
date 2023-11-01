import {IBlackList} from "../../models/AssessorResponse";
import React, {useState} from "react";
import Dialog from "../UI/Dialog";
import AssessorHistory from "../Assessors/AssessorPage/AssessorHistory/AssessorHistory";

const BlackListEdit = ({assessor}: {
    assessor: IBlackList
}) => {
    const [isShowHistory, setIsShowHistory] = useState(false)
    return (
        <>
            <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                <AssessorHistory assessorId={assessor.assessor.id}/>
            </Dialog>
            <div className='flex flex-col'>
                <button onClick={() => setIsShowHistory(true)}>История</button>
            </div>
        </>
    );
};
export default BlackListEdit