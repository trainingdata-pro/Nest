import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {Dispatch} from "react";


export const useReturnFromFreeResources = ({assessorId, show}: {
    assessorId: number|string,
    show: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()
    return useMutation('currentAssessor', () => AssessorService.returnFromFreeResources(assessorId, {free_resource:false}),{
        onSuccess: () => {
            queryClient.invalidateQueries('currentAssessor')
            queryClient.invalidateQueries('assessorHistory')
            queryClient.invalidateQueries('freeResources')
            successNotification('Ассессор возвращен в команду')
            show(false)
        }, onError: (error:any) => {
            errorNotification('Произошла ошибка')}
    })
}