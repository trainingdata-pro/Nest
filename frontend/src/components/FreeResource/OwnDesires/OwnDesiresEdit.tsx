import React, {useContext, useState} from 'react';
import {FiredAssessor} from "../../../models/AssessorResponse";
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../services/AssessorService";
import Dialog from "../../UI/Dialog";
import AssessorHistory from "../../Assessors/AssessorPage/AssessorHistory/AssessorHistory";
import {Context} from "../../../index";
import {errorNotification, successNotification} from "../../UI/Notify";
import RentAssessor from "../../AssessorManagement/RentAssessor/RentAssessor";

const OwnDesiresEdit = ({assessor}: {
    assessor: FiredAssessor
}) => {
    const {store} = useContext(Context)
    const queryClient = useQueryClient()
    const takeFromOwnDesires = useMutation(['assessors'], () => AssessorService.takeFromOwnDesires(assessor.id, {manager: store.user_id}), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessors')
            queryClient.invalidateQueries('fired')
            successNotification('Ассессор успешно забран в команду')
        },
        onError: () => {
            errorNotification('Произошла ошибка')
        }
    })

    const [isShowHistory, setIsShowHistory] = useState(false)
    const [showRentAssessor, setShowRentAssessor] = useState(false)
    return (
        <>
            <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                <AssessorHistory assessorId={assessor.id}/>
            </Dialog>
            <Dialog isOpen={showRentAssessor} setIsOpen={setShowRentAssessor}>
                <RentAssessor assessorId={assessor.id} show={setShowRentAssessor}/>
            </Dialog>
            <div className='flex flex-col'>
                <button onClick={() => setIsShowHistory(true)}>История</button>
                {assessor.assessor.manager?.id !== store.user_id && (!assessor.assessor.manager?.id ?
                    <button onClick={() => takeFromOwnDesires.mutate()}>Забрать в команду</button> :
                    <button onClick={() => setShowRentAssessor(true)}>Арендовать</button>)}
            </div>
        </>
    );
};

export default OwnDesiresEdit;