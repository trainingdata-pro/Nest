import React, {useContext, useState} from 'react';
import Dialog from "../UI/Dialog";
import {Assessor} from "../../models/AssessorResponse";
import AssessorHistory from "../Assessors/AssessorPage/AssessorHistory";



const FreeResourceEdit = ({assessor}: {
    assessor: Assessor
}) => {
    const [isShowHistory, setIsShowHistory] = useState(false)
    return (
        <>
            <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                <AssessorHistory assessorId={assessor.id}/>
            </Dialog>
            <div className='flex flex-col'>
                <button onClick={() => setIsShowHistory(true)}>История</button>
            </div>
        </>
    );
};

export default FreeResourceEdit;