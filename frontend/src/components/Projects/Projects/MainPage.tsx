import React, {useState} from 'react';
import Header from "../../Header/Header";
import Loader from "../../UI/Loader";
import Dialog from "../../UI/Dialog";
import ProjectForm from "../ProjectForm/ProjectForm";
import MyButton from "../../UI/MyButton";
import Table from "../../UI/Table";
import {useProjectsSorting} from "./columns";
import {useFetchProjects} from "./queries";
import Confirm from "../../UI/Confirm";

const MainPage = () => {
    const {getSortingString,projectsId, sorting, setShowSidebar, setProjectId, columns, showSidebar} = useProjectsSorting()
    const {projects, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit} = useFetchProjects({sorting: sorting, sortingString: getSortingString()})
    const [isOpenConfirm, setIsOpenConfirm] = useState(false)
    const closeDialog = () => {
        setIsOpenConfirm(true)
    }
    const confirmAction = () => {

    }
    if (projects.isLoading) {
        return <Loader/>
    }

    return (
        <div>
            <Header/>

            <div className="pt-20 items-center pb-6">
                <Dialog isOpen={isOpenConfirm} setIsOpen={confirmAction} topLayer={true}>
                    <Confirm isCloseConfirm={setIsOpenConfirm} isCloseModal={setShowSidebar}/>
                </Dialog>

                <Dialog isOpen={showSidebar} setIsOpen={closeDialog}>
                    <ProjectForm projectId={projectsId}
                                 closeSidebar={closeDialog} isOpenModal={setShowSidebar}/>
                </Dialog>
                <div className="h-full w-full px-8">
                    <div className="flex-col items-center">
                        <div className="flex justify-between my-2">
                            <div className='my-auto'>
                                <p>Всего проектов: {projects.data?.count}</p>
                            </div>
                            <MyButton onClick={() => {
                                setProjectId(0)
                                setShowSidebar(true)
                            }}>Добавить проект
                            </MyButton>
                        </div>
                        <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                        <Table data={projects.isSuccess ? projects.data.results : []} columns={columns} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                               setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit} pages={true}/>

                        </div></div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;