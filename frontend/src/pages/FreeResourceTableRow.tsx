import React, {useContext, useState} from 'react';
import {Assessor} from "../models/AssessorResponse";
import {useMutation, useQuery, useQueryClient} from "react-query";
import AssessorService from "../services/AssessorService";
import Dialog from "../components/UI/Dialog";
import AssessorHistory from "../components/Assessors/AssessorHistory";
import {useCalendarState} from "@mui/x-date-pickers/internals";
import {Context} from "../index";
import {errorNotification, successNotification} from "../components/UI/Notify";
import RentAssessor from "../components/AssessorManagement/RentAssessor";

const FreeResourceTableRow = ({assessor}: {
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

    const assessorHistoryManager = useQuery(['assessorHistoryManager', assessor.id], () => AssessorService.fetchAssessorHistory(assessor.id, 'manager'), {})
    const assessorHistoryProject = useQuery(['assessorHistoryProject', assessor.id], () => AssessorService.fetchAssessorHistory(assessor.id, 'project'), {})
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
            <tr className="text-center border-t dark:border-neutral-500">
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.last_name}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.first_name}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.middle_name}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.username}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessorHistoryManager.data?.results[0]?.old_value}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessorHistoryProject.data?.results[0]?.old_value}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.free_resource_weekday_hours}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.free_resource_day_off_hours}</td>
                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.skills.map(skill => skill.title).join(', ')}</td>
                <td className="whitespace-nowrap px-[5px] py-[20px] flex flex-col justify-center">
                    <button onClick={() => setIsShowHistory(true)}>История</button>
                    {assessor.manager?.id !== store.user_id && (!assessor.manager?.id ?
                        <button onClick={() => addAssessorToManager.mutate()}>Забрать в команду</button> :
                        <button onClick={() => setShowRentAssessor(true)}>Арендовать</button>)}
                </td>
            </tr>
        </>
    );
};

export default FreeResourceTableRow;