import React, {Dispatch, FC, useState} from 'react';
import Loader from "../../UI/Loader";
import Dialog from "../../UI/Dialog";
import ProjectForm from "../ProjectForm/ProjectForm";
import MyButton from "../../UI/MyButton";
import Table from "../../UI/Table";
import {useProjectsSorting} from "./columns";
import {useFetchProjects} from "./queries";
import Confirm from "../../UI/Confirm";

interface ICreateForm {
    setShowSidebar: Dispatch<boolean>,
    showSidebar: boolean,
    projectId: number,
    setProjectId: Dispatch<number>
}

const CreateProject: FC<ICreateForm> = ({setShowSidebar, showSidebar, projectId, setProjectId}) => {
    const [isOpenConfirm, setIsOpenConfirm] = useState(false)
    const closeDialog = () => {
        setIsOpenConfirm(true)
    }
    return <>
        <Dialog isOpen={isOpenConfirm} setIsOpen={() => {
        }} topLayer={true}>
            <Confirm isCloseConfirm={setIsOpenConfirm} isCloseModal={setShowSidebar}/>
        </Dialog>

        <Dialog isOpen={showSidebar} setIsOpen={closeDialog}>
            <ProjectForm projectId={projectId}
                         closeSidebar={closeDialog} isOpenModal={setShowSidebar}/>
        </Dialog>
        <MyButton onClick={() => {
            setProjectId(0)
            setShowSidebar(true)
        }}>Добавить проект
        </MyButton>
    </>
}
const Projects = () => {
    const {
        getSortingString,
        projectId,
        sorting,
        setShowSidebar,
        setProjectId,
        columns,
        showSidebar
    } = useProjectsSorting()
    const {
        projects,
        currentPage,
        setCurrentPage,
        totalPages,
        totalRows,
        pageLimit,
        setPageLimit
    } = useFetchProjects({sorting: sorting, sortingString: getSortingString()})

    if (projects.isLoading) {
        return <Loader/>
    }

    return (
        <>
            <div className="flex-col items-center">
                <div className="flex justify-between my-2">
                    <div className='my-auto'>
                        <p>Всего проектов: {projects.data?.count}</p>
                    </div>
                    <CreateProject setShowSidebar={setShowSidebar} showSidebar={showSidebar} projectId={projectId}
                                   setProjectId={setProjectId}/>
                </div>
                <Table data={projects.isSuccess ? projects.data.results : []} columns={columns}
                       totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                       setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit}
                       pages={true}/>

            </div>
        </>
    );
};

export default Projects;