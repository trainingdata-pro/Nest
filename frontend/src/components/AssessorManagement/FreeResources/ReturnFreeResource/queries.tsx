import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {Dispatch} from "react";


export const useReturnFromFreeResources = ({assessorId, show}: {
    assessorId: number|string,
    show: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()
    return useMutation(['currentAssessor', assessorId], () => AssessorService.returnFromFreeResources(assessorId, {free_resource:false}),{
        onSuccess: () => {
            queryClient.invalidateQueries(['currentAssessor', assessorId])
            queryClient.invalidateQueries(['assessorHistory', assessorId])
            queryClient.invalidateQueries('freeResources')
            successNotification('Ассессор возвращен в команду')
            show(false)
        }, onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])}
    })
}