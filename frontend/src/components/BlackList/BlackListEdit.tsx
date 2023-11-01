import {Assessor, IBlackList} from "../../models/AssessorResponse";
import React, {useContext, useState} from "react";
import {Context} from "../../index";
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";
import {errorNotification, successNotification} from "../UI/Notify";
import Dialog from "../UI/Dialog";
import AssessorHistory from "../Assessors/AssessorPage/AssessorHistory/AssessorHistory";
import RentAssessor from "../AssessorManagement/RentAssessor/RentAssessor";

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