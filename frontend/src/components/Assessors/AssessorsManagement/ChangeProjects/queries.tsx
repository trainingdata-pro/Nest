import {useMutation, useQuery} from "react-query";
import ProjectService from "../../../../services/ProjectService";
import AssessorService from "../../../../services/AssessorService";

export const useFetchProjects = ({extendProjects}: {
    extendProjects: number[]
}) => {
    return useQuery(['projects'], () => ProjectService.fetchProjects(), {
        select: data => [...data.results.filter(project => extendProjects.find(projectId => projectId.toString() === project.id.toString()) === undefined)]
    })
}

export const useChangeAssessorProjects = () => {
    return useMutation('assessors', ({id, data}: any) => AssessorService.addAssessorProject(id, data))
}