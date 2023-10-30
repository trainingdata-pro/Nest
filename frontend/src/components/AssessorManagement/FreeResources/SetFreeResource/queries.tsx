import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";

interface Props {
    assessorId: any,
    data:any
}
export const useSetFreeResource = ({assessorId, setShowAddToFreeResource}:{assessorId:string|number, setShowAddToFreeResource:any}) => {
    const queryClient = useQueryClient()
    return useMutation(['currentAssessor', assessorId], ({assessorId, data}: Props) => AssessorService.addToFreeResource(assessorId, data),{
        onSuccess: () => {
            queryClient.invalidateQueries(['currentAssessor', assessorId])
            queryClient.invalidateQueries(['assessorHistory', assessorId])
            successNotification('Ассесор успешно добавлен в свободные ресурсы')
            setShowAddToFreeResource(false)
        },
        onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])}
    })
}