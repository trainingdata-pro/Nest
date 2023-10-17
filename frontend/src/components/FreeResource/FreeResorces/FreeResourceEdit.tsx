import React, {useContext, useState} from 'react';
import {Assessor} from "../../../models/AssessorResponse";
import {useMutation, useQuery, useQueryClient} from "react-query";
import AssessorService from "../../../services/AssessorService";
import Dialog from "../../UI/Dialog";
import AssessorHistory from "../../Assessors/AssessorHistory";
import {useCalendarState} from "@mui/x-date-pickers/internals";
import {Context} from "../../../index";
import {errorNotification, successNotification} from "../../UI/Notify";
import RentAssessor from "../../AssessorManagement/RentAssessor";

const FreeResourceEdit = ({assessor}: {
    assessor: Assessor
}) => {
    const {store} = useContext(Context)
    const queryClient = useQueryClient()
    const addAssessorToManager = useMutation(['assessors'], () => AssessorService.takeFromFreeResource(assessor.id, {manager: store.user_id}), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessors')
            queryClient.invalidateQueries('freeResources')
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
            {assessor.manager?.id !== store.user_id && (!assessor.manager?.id ?
                <button onClick={() => addAssessorToManager.mutate()}>Забрать в команду</button> :
                <button onClick={() => setShowRentAssessor(true)}>Арендовать</button>)}
            </div>
            </>
    );
};

export default FreeResourceEdit;