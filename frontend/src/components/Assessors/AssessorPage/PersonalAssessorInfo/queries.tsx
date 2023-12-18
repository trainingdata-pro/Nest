import {useMutation, useQuery} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {UseFormSetValue} from "react-hook-form";
import {AxiosError} from "axios";
import {errorNotification, successNotification} from "../../../UI/Notify";
import React, {Dispatch} from "react";
import {ASSESSOR_INFO_ERRORS, T} from "../../../../assets/consts";
import {notifyError} from "../../../../utils/errorResponseNotification";

export interface PersonalTableProps {
    last_name: string,
    first_name: string,
    middle_name: string,
    manager: string
    username: string,
    email: string,
    country: string
}
interface FetchAssessorInfoProps {
    setValue: UseFormSetValue<PersonalTableProps>,
    assessorId: number | string | undefined
}
interface PatchAssessorInfoProps {
    setIsDisabled: Dispatch<boolean>,
    assessorId: number | string | undefined
}
export const useFetchAssessorInfo = ({setValue, assessorId}: FetchAssessorInfoProps) => {
    return useQuery(['currentAssessorInfo'], () => AssessorService.fetchAssessor(assessorId), {
        refetchOnWindowFocus:false,
        onSuccess: data => {
            setValue("last_name", data?.last_name)
            setValue("first_name", data?.first_name)
            setValue("middle_name", data?.middle_name)
            setValue('manager', `${data?.manager.last_name} ${data?.manager.first_name}`)
            setValue("username", data?.username)
            setValue("email", data?.email)
            setValue("country", data?.country)
        }
    })
}





export const usePatchAssessorInfo = ({assessorId, setIsDisabled}: PatchAssessorInfoProps) => {
    return useMutation(['currentAssessorInfo', assessorId], ({
                                                                 id,
                                                                 data
                                                             }: any) => AssessorService.patchAssessor(id, data), {
        onError: (error: AxiosError<typeof ASSESSOR_INFO_ERRORS>) => notifyError(error),
        onSuccess: () => {
            successNotification('Информация успешно обновлена')
            setIsDisabled(true)
        }
    })
}