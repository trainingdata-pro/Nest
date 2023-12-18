import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {API_URL} from "../http";
import {Project, ServerResponse} from "../models/ProjectResponse";
import {BaseQueryArg} from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {Assessor} from "../models/AssessorResponse";

interface IQueryParams {
    id?: number | undefined
    page: number,
    page_size: number,
    sorting: string,
    status?: string
}
export const projectAPI = createApi({
    reducerPath: 'projectAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL
    }),
    tagTypes: ['Projects'],
    endpoints: (builder) => ({
        fetchProjects: builder.query<ServerResponse<Project>, IQueryParams>({
            query: ({page = 10, page_size = 10, sorting = '', status = 'active,pause'}) => ({
                url: '/api/projects',
                params: {
                    page: page,
                    page_size: page_size,
                    ordering: sorting,
                    status: status
                },
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },

            }),
        }),
        fetchProjectAssessors : builder.query<ServerResponse<Assessor>, IQueryParams>({
            query: ({id, page, page_size, sorting }) => ({
                url: `/api/projects/${id}/assessors/`,
                params: {
                    page: page,
                    page_size: page_size,
                    ordering: sorting
                },
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
        }),
        fetchCompletedProjects: builder.query<ServerResponse<Project>,  IQueryParams>({
            query: ({id, page, page_size, sorting, status = 'active,pause'}) => ({
                url: '/api/projects',
                params: {
                    page: page,
                    page_size: page_size,
                    ordering: sorting,
                    status: status
                },
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },

            })
        }),
        createProject: builder.mutation<any, any>({
            query: ({data, setIsOpen}) => ({
                url: '/api/projects/',
                method: 'post',
                body: data,
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                invalidatesTags: ['Projects'],
            }),
        }),

    }),

})

export const {useFetchProjectsQuery, useFetchProjectAssessorsQuery, useFetchCompletedProjectsQuery, useCreateProjectMutation} = projectAPI