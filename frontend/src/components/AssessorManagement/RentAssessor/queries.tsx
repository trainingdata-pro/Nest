import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../../services/ProjectService";
import AssessorService from "../../../services/AssessorService";
import {errorNotification, successNotification} from "../../UI/Notify";
import React, {useContext} from "react";
import {Context} from "../../../index";


export const useGetProjects = () => {
    async function fetchAllData() {
        const allData = [];
        let currentPage = 1;
        let hasMoreData = true;
        while (hasMoreData) {
            const data = await ProjectService.fetchProjects(currentPage);
            allData.push(...data.results);
            if (data.next !== null) {
                currentPage++;
            } else {
                hasMoreData = false;
            }
        }
        return allData;
    }
    return useQuery(['projects'], () => fetchAllData(), {
        keepPreviousData: true
    })
}

export const useRentAssessor = ({assessorId, show, project}:{
    assessorId: string | number,
    show: React.Dispatch<boolean>,
    project: number | string | undefined
}) => {
    const queryClient = useQueryClient()
    const {store} = useContext(Context)
    return useMutation(['assessors'], () => AssessorService.takeFromFreeResource(assessorId, {
        second_manager: store.user_id,
        project: project
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessors')
            queryClient.invalidateQueries('freeResources')
            successNotification('Ассессор успешно арендован')
            show(false)
        },
        onError: () => {
            errorNotification('Произошла ошибка')
        }
    })
}