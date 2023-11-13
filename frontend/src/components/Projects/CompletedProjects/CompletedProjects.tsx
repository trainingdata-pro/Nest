import React, {useState} from 'react';
import {observer} from "mobx-react-lite";
import Dialog from "../../UI/Dialog";
import Export from "../Export";
import {useCompletedProjectsColumns} from "./columns";
import Loader from "../../UI/Loader";
import {useCompletedProjects} from "./queries";
import ProjectForm from "../ProjectForm/ProjectForm";
import Table from "../../UI/Table";
import CompletedProjectsMenu from "./CompletedProjectsMenu";

const CompletedProjects = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [projectId, setProjectId] = useState(0)
    const {sorting, getSortingString, columns} = useCompletedProjectsColumns({setProjectId, setShowSidebar})
    const {
        currentPage,
        setCurrentPage,
        totalPages,
        totalRows,
        completedProjects,
        pageLimit,
        setPageLimit
    } = useCompletedProjects({sorting, getSortingString})
    const [isExportProjects, setIsExportProjects] = useState(false)


    if (completedProjects.isFetching) return <Loader height={'h-[calc(100vh-80px)]'}/>
    return (
        <React.Fragment>
            <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                <ProjectForm projectId={projectId}
                             closeSidebar={setShowSidebar} isOpenModal={setShowSidebar}/>
            </Dialog>
            <Dialog isOpen={isExportProjects} setIsOpen={setIsExportProjects}>
                <Export setIsExportProjects={setIsExportProjects} exportType='completedProjects'
                        project={undefined}/>
            </Dialog>
            <CompletedProjectsMenu/>
            <div className='rounded-[20px] bg-white'>
                <Table data={completedProjects.isSuccess ? completedProjects.data.results : []}
                       columns={columns} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                       setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit}
                       pages={true}/>
            </div>
        </React.Fragment>
    );
};

export default observer(CompletedProjects);