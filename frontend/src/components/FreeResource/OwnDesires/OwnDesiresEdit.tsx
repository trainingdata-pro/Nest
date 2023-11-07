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
    const getPermissions = () => {
        if (store.user_data.is_teamlead){
            return;
        } else {
            if(assessor.assessor.manager?.id !== store.user_id){
                return <button onClick={() => takeFromOwnDesires.mutate()}>Забрать в команду</button>
            }
        }
    }
    const [isShowHistory, setIsShowHistory] = useState(false)
    const [showRentAssessor, setShowRentAssessor] = useState(false)
    return (
        <>
            <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                <AssessorHistory assessorId={assessor.assessor.id}/>
            </Dialog>
            <Dialog isOpen={showRentAssessor} setIsOpen={setShowRentAssessor}>
                <RentAssessor assessorId={assessor.assessor.id} show={setShowRentAssessor}/>
            </Dialog>
            <div className='flex flex-col'>
                <button onClick={() => setIsShowHistory(true)}>История</button>
                {getPermissions()}
            </div>
        </>
    );
};

export default OwnDesiresEdit;