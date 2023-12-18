import AssessorService from "../../../services/AssessorService";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useNavigate} from "react-router-dom";
import {errorNotification, successNotification} from "../../UI/Notify";
import { Dispatch } from "react";


export const useFetchReason = () => {
    return useQuery(['reasons'], () => AssessorService.fetchReasons())
}

export const useAddAssessorToFired = ({close}: {
    close: Dispatch<boolean>,
}) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const addAssessorToFired = useMutation('currentAssessor', ({id, data}: any) => AssessorService.addAssessorToFired(id, data),{
        onSuccess: () => {
            queryClient.invalidateQueries('assessorHistory')
            queryClient.invalidateQueries('currentAssessor')
            successNotification('Ассесор успешно уволен')
            close(false)
            navigate(-1)
        }, onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])
        }
    })
    return {addAssessorToFired}
}