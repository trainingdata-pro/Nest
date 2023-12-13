import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";

export interface AddToFreeResourceProps {
    free_resource: boolean,
    "reason": string,
    "free_resource_weekday_hours": string,
    "free_resource_day_off_hours": string
}
interface Props {
    assessorId: any,
    data: AddToFreeResourceProps
}
export const useSetFreeResource = ({assessorId, setShowAddToFreeResource}:{assessorId:string|number, setShowAddToFreeResource:any}) => {
    const queryClient = useQueryClient()
    return useMutation('currentAssessor', ({assessorId, data}: Props) => AssessorService.addToFreeResource(assessorId, data),{
        onSuccess: () => {
            queryClient.invalidateQueries('currentAssessor')
            queryClient.invalidateQueries('assessorHistory')
            successNotification('Асессор успешно добавлен в свободные ресурсы')
            setShowAddToFreeResource(false)
        },
        onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])}
    })
}