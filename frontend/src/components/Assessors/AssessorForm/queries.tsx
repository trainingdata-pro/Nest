import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../../services/ProjectService";
import AssessorService from "../../../services/AssessorService";
import {errorNotification, successNotification} from "../../UI/Notify";
import {Dispatch} from "react";


export const useFetchAvailableProjects = () => {
    const availableProjects = useQuery(['availableProjects'], () => ProjectService.fetchProjects(1, ''), {
        select: data => data.results.map(project => {
                    return {label: project.name, value: project.id}
                }
            )

    })
    return {availableProjects}
}

export const useFetchManagerProjects = ({managerId}: {
    managerId: string | number
}) => {
    const currentManagerProjects = useQuery(['currentManagerProjects', managerId], () => ProjectService.fetchProjectsByManager(managerId), {
        enabled: !!managerId && managerId.toString() !== '0',
        select: data => data.results.map(project => {
                return {label: project.name, value: project.id}
            }
        )
    })
    return {currentManagerProjects}
}


export const useCreateAssessor = ({setShowSidebar, getValues}: {
    setShowSidebar: Dispatch<boolean>,
    getValues: any
}) => {
    const queryClient = useQueryClient()

    const updateAssessorProject = useMutation(['projectAssessors',], ({
                                                                          id,
                                                                          data
                                                                      }: any) => AssessorService.addAssessorProject(id, data), {
        onSuccess: data => {
            if (getValues("status")) createWorkloadStatus.mutate({
                data: {
                    assessor: data.id,
                    project: getValues('projects'),
                    status: getValues('status')
                }
            })
            queryClient.invalidateQueries('projectAssessors')
            queryClient.invalidateQueries('assessors')
            successNotification('Ассессор успешно назначен на проект')
            setShowSidebar(false)
        },
        onError: (error: any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])
        }
    })
    const createWorkloadStatus = useMutation(['projectAssessors'], ({data}: any) => AssessorService.createWorkloadStatus(data), {
        onSuccess: () => {
            queryClient.invalidateQueries('projectAssessors')
            queryClient.invalidateQueries('assessors')
            successNotification('Ассессору успешно присвоен статус')
            setShowSidebar(false)
        },
        onError: (error: any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])
        }

    })
    const createAssessor = useMutation(['projectAssessors'], ({data}: any) => AssessorService.addAssessor(data), {
        onSuccess: data => {
            if (getValues("projects")) updateAssessorProject.mutate({
                id: data.id,
                data: {projects: [getValues('projects')]}
            })
            queryClient.invalidateQueries('projectAssessors')
            queryClient.invalidateQueries('assessors')
            successNotification('Ассессор успешно создан')
            setShowSidebar(false)
        },
        onError: (error: any) => {
            const jsonError = JSON.parse(error.request.responseText)
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])
        }
    })
    return {createAssessor}

}