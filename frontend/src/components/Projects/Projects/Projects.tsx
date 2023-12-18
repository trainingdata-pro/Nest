import React from 'react';
import Loader from "../../UI/Loader";
import Table from "../../UI/Table";
import {useProjectsSorting} from "./columns";
import {useFetchProjectsQuery} from "../../../services/project";
import {CreateProject} from "./CreateProject";
import {usePagination} from "../../../hooks/usePagination";


const Projects = () => {
    const {
        sortingString,
        projectId,
        setShowSidebar,
        setProjectId,
        columns,
        showSidebar
    } = useProjectsSorting()
    const {
        currentPage,
        setCurrentPage,
        pageLimit,
        setPageLimit
    } = usePagination('projectPageLimit')
    const {data, isLoading,isFetching} = useFetchProjectsQuery({
        page: currentPage,
        page_size: pageLimit,
        sorting: sortingString
    })
    return (
        <>
            <div className="flex justify-between my-2">
                <div className='my-auto'>
                    <p>Всего проектов: {data?.count}</p>
                </div>
                <CreateProject setShowSidebar={setShowSidebar} showSidebar={showSidebar} projectId={projectId}
                               setProjectId={setProjectId}/>
            </div>
            <Table data={data ? data.results : []}
                   isLoading={isFetching}
                   columns={columns}
                   totalRows={data ? data.count : 0}
                   currentPage={currentPage}
                   totalPages={data ? Math.ceil(data.count / pageLimit) : 1}
                   setCurrentPage={setCurrentPage}
                   pageLimit={pageLimit}
                   setPageLimit={setPageLimit}
            />
        </>
    );
};

export default Projects;