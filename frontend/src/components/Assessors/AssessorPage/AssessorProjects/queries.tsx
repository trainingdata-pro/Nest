import {useMutation, useQueryClient} from "react-query";
import {PatchWorkingHours, WorkingHours} from "../../../../models/AssessorResponse";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {AxiosError} from "axios";
import React, {Dispatch} from "react";
import {ASSESSOR_PROJECTS_ERRORS} from "../../../../assets/consts";
import {notifyError} from "../../../../utils/errorResponseNotification";


export const usePatchWorkingHours = ({setIsDisabled}: {
    setIsDisabled: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()

    return useMutation(['workingHours'], ({id, data}: {
        id: string | number,
        data: PatchWorkingHours
    }) => AssessorService.patchWorkingHours(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workingHours')
            queryClient.invalidateQueries('assessorProjectsNew')
            successNotification('Рабочие часы обновлены')
            setIsDisabled(true)
        },
        onError: (error: AxiosError<typeof ASSESSOR_PROJECTS_ERRORS>) => notifyError(error)
        
    })
}

export const usePostWorkingHours = ({setIsDisabled}: {
    setIsDisabled: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()
    return useMutation(['workingHours'], (data: WorkingHours) => AssessorService.createWorkingHours(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workingHours')
            queryClient.invalidateQueries('assessorProjectsNew')
            successNotification('Рабочие часы обновлены')
        },
        onError: (error: AxiosError) => {
            const errors = error.response?.data ? error.response?.data : {}
            const keys = Object.keys(errors)
            // @ts-ignore
            const notify = <div>{keys.map(key => <p key={key}>{`${Errors[key]}: ${errors[key][0]}`}</p>)}</div>
            errorNotification(notify)
            setIsDisabled(true)
        }
    })
}

export const usePatchWorkloadStatus = ({setIsDisabled}: {
    setIsDisabled: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()
    return useMutation(['workloadStatus'], ({id, data}: {
        id: string | number | undefined,
        data: any
    }) => AssessorService.patchWorkloadStatus(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workloadStatus')
            queryClient.invalidateQueries('assessorProjectsNew')
            successNotification('Статус загрузки обновлен')
        },
        onError: (error: AxiosError) => {
            const errors = error.response?.data ? error.response?.data : {}
            const keys = Object.keys(errors)
            // @ts-ignore
            const notify = <div>{keys.map(key => <p key={key}>{`${Errors[key]}: ${errors[key][0]}`}</p>)}</div>
            errorNotification(notify)
        }
    })
}

export const usePostWorkloadStatus = ({setIsDisabled}: {
    setIsDisabled: Dispatch<boolean>
}) => {
    const queryClient = useQueryClient()
    return useMutation(['workloadStatus'], (data: {
        assessor: string | number | undefined,
        project: string | number,
        status: any
    }) => AssessorService.createWorkloadStatus(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('workloadStatus')
            queryClient.invalidateQueries('assessorProjectsNew')
            successNotification('Статус загрузки обновлен')
        },
        onError: (error: AxiosError) => {
            const errors = error.response?.data ? error.response?.data : {}
            const keys = Object.keys(errors)
            // @ts-ignore
            const notify = <div>{keys.map(key => <p key={key}>{`${Errors[key]}: ${errors[key][0]}`}</p>)}</div>
            errorNotification(notify)
        }
    })
}