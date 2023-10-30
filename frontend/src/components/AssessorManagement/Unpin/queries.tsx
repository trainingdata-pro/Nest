import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../services/AssessorService";
import {errorNotification, successNotification} from "../../UI/Notify";
import {useNavigate} from "react-router-dom";
import {Dispatch} from "react";
import {AxiosError} from "axios";


export const useUnpin = ({close}: {
    close: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    return useMutation(['assessors'], ({assessorId,data}: any) => AssessorService.unpinAssessor(assessorId, data),{
        onSuccess: () => {
            queryClient.invalidateQueries(['assessors'])
            successNotification('Ассессор успешно откреплен')
            close(false)
            navigate(-1)
        },
        onError: (error:AxiosError) => {
            // @ts-ignore
            errorNotification(error.response.data.detail[0])
        }
    })
}