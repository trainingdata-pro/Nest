import {useMutation, useQuery} from "react-query";
import ProjectService from "../../../../services/ProjectService";
import AssessorService from "../../../../services/AssessorService";

export const useFetchProjects = () => {
    return
}

export const useChangeAssessorProjects = () => {
    return useMutation('assessors', ({id, data}: any) => AssessorService.addAssessorProject(id, data))
}