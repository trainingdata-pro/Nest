import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import Dialog from "../../UI/Dialog";
import {useCompletedProjectsColumns} from "./columns";
import ProjectForm from "../ProjectForm/ProjectForm";
import Table from "../../UI/Table";
import CompletedProjectsMenu from "./CompletedProjectsMenu";
import {useFetchCompletedProjectsQuery} from "../../../services/project";
import {usePagination} from "../../../hooks/usePagination";

const CompletedProjects = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [projectId, setProjectId] = useState(0)
    const {
        getSortingString,
        columns
    } = useCompletedProjectsColumns({
        setProjectId,
        setShowSidebar
    })

    const {
        currentPage,
        setCurrentPage,
        pageLimit,
        setPageLimit
    } = usePagination('completedProjectPage')
    const {
        data,
        isFetching,
        isSuccess
    } = useFetchCompletedProjectsQuery({
        page: currentPage,
        page_size: pageLimit,
        sorting: getSortingString()
    })

    return (
        <React.Fragment>
            <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                <ProjectForm projectId={projectId}
                             closeSidebar={setShowSidebar}
                             isOpenModal={setShowSidebar}
                />
            </Dialog>
            <CompletedProjectsMenu/>
            <Table data={isSuccess ? data.results : []}
                   isLoading={isFetching}
                   columns={columns}
                   totalRows={data?.count ? data.count : 0}
                   currentPage={currentPage}
                   totalPages={isSuccess ? Math.ceil(data.count / pageLimit) : 1}
                   setCurrentPage={setCurrentPage}
                   pageLimit={pageLimit}
                   setPageLimit={setPageLimit}
            />
        </React.Fragment>
    );
};

export default observer(CompletedProjects);