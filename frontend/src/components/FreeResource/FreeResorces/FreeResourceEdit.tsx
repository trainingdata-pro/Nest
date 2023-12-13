import React, {useContext, useState} from 'react';
import {Assessor} from "../../../models/AssessorResponse";
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../services/AssessorService";
import Dialog from "../../UI/Dialog";
import AssessorHistory from "../../Assessors/AssessorPage/AssessorHistory/AssessorHistory";
import {Context} from "../../../index";
import {errorNotification, successNotification} from "../../UI/Notify";
import RentAssessor from "../../AssessorManagement/RentAssessor/RentAssessor";
import ReturnFromFreeResources from "../../AssessorManagement/FreeResources/ReturnFreeResource/ReturnFromFreeResources";

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
    const getPermissions = () => {
        if (store.user_data.is_teamlead) {
            if (store.team.find(manager => manager.user.id.toString() === assessor.manager?.id.toString()) !== undefined) {
                return <ReturnFromFreeResources assessorId={assessor.id}/>
            }
        } else {
            if (assessor.manager?.id.toString() !== store.user_id.toString()) {
                if (!assessor.manager?.id) {
                    return <button onClick={() => addAssessorToManager.mutate()}>Забрать в команду</button>
                } return <button onClick={() => setShowRentAssessor(true)}>Арендовать</button>
            } else {
                return <ReturnFromFreeResources assessorId={assessor.id}/>
            }
        }
    }
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
                {getPermissions()}
            </div>
        </>
    );
};

export default FreeResourceEdit;