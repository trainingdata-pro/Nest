import React, {useContext, useState} from 'react';
import {Context} from '../../index';
import ProjectService from '../../services/ProjectService';
import {observer} from "mobx-react-lite";
import Loader from "../UI/Loader";
import ProjectForm from "./ProjectForm";
import Dialog from "../UI/Dialog";
import ProjectsTable from "./ProjectsTable";
import {useQuery} from "react-query";
import TablePagination from "../UI/TablePagination";

const PersonalAccountTable = () => {
    const {store} = useContext(Context)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageLimit, setPageLimit] = useState(10)
    const {
        data,
        isLoading,
    } = useQuery(['projects', currentPage, pageLimit], () => ProjectService.fetchProjects(store.user_id, currentPage, pageLimit),{
        onSuccess: (data) => {
            setTotalProjects(data.count)
            setCountPages(Math.ceil(data.count/pageLimit))
        },
        keepPreviousData: true
    })

    const [projectsId, setProjectId] = useState(0)
    const [showSidebar, setShowSidebar] = useState(false)
    const [totalProjects, setTotalProjects] = useState<number>(0)
    const [countPages, setCountPages] = useState(1)

    if (isLoading) {
        return <Loader width={"16"}/>
    }

    return (
        <>
            <div className="pt-20 items-center pb-6">
                <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                        <ProjectForm projectId={projectsId}
                                     closeSidebar={setShowSidebar}/>
                </Dialog>
                <div className="h-full w-full px-8">

                    <div className="flex-col container items-center">
                        <div className="flex justify-between my-2">
                            <div>Всего активных проектов: {totalProjects}</div>
                            <button className="bg-[#5970F6] rounded-md text-white px-4 py-2"
                                    onClick={() => {
                                        setProjectId(0)
                                        setShowSidebar(true)
                                    }}>Добавить проект
                            </button>
                        </div>
                        <div className='rounded-[20px] bg-white overflow-hidden pb-4'>
                            <ProjectsTable data={data?.results} setProjectId={setProjectId} setShowSidebar={setShowSidebar}/>
                            <TablePagination totalProjects={data?.results.length} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={countPages} pageLimit={pageLimit} setPageLimit={setPageLimit}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default observer(PersonalAccountTable);