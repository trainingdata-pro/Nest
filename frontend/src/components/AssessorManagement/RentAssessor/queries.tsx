import {useMutation, useQuery, useQueryClient} from "react-query";
import ProjectService from "../../../services/ProjectService";
import AssessorService from "../../../services/AssessorService";
import {errorNotification, successNotification} from "../../UI/Notify";
import React, {useContext, useState} from "react";
import {Context} from "../../../index";


export const useFetchProjects = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [pageLimit, setPageLimit] = useState(10)
    const fetchProjects = useQuery(['projects', pageLimit, currentPage], () => ProjectService.fetchProjects(currentPage, '', pageLimit), {
        keepPreviousData: true,
        onSuccess: data1 => {
            setTotalRows(data1.count)
            setTotalPages(Math.ceil(data1.count / pageLimit))
        }
    })
    return {fetchProjects, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit}
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