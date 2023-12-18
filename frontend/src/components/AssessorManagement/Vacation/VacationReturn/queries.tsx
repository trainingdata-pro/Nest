import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {Dispatch} from "react";


export const useVacationReturn = ({setIsReturnVacation}: {
    setIsReturnVacation: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()

    return useMutation('currentAssessor', ({id, data}:any) => AssessorService.patchVacation(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessorHistory')
            queryClient.invalidateQueries('currentAssessor')
            successNotification('Ассесор возвращен из отпуска')
            setIsReturnVacation(false)
        }, onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])
        }
    })
}