import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {Dispatch} from "react";


export const useSetVacation = ({assessorId, close}: {
    assessorId: number | string | undefined,
    close: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()

    return useMutation('currentAssessor', (value: any) => AssessorService.patchVacation(assessorId, {vacation: true, vacation_date: value}), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessorHistory')
            queryClient.invalidateQueries('currentAssessor')
            successNotification('Ассессор отправлен в отпуск')
            close(false)
        },
        onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])

        }
    })
}