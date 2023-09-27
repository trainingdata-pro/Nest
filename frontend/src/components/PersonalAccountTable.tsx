import React, {useContext, useEffect, useState} from 'react';
import {Context} from '../index';
import ProjectService from '../services/ProjectService';
import {Project} from "../models/ProjectResponse";
import {observer} from "mobx-react-lite";
import Loader from "./UI/Loader";
import ProjectForm from "./ProjectForm";
import Dialog from "./UI/Dialog";
import NewTable from "./NewTable";



const PersonalAccountTable = () => {
    const {store} = useContext(Context)
    const [projectsId, setProjectId] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageLimit, setPageLimit] = useState(10)

    useEffect(() => {
        setIsLoading(true)
        ProjectService.fetchProjects(store.user_id, currentPage, pageLimit).then(res => {
            setData(res.data.results.filter(project => project.status !== 'completed'))
            setCountPages(Math.ceil(res.data.count / pageLimit))
        })
        setIsLoading(false)
    }, [store.user_data, currentPage, pageLimit])

    const [data, setData] = useState<Project[]>([])
    const [countPages, setCountPages] = useState(1)

    if (isLoading) {
        return <Loader width={"16"}/>
    }

    return (
        <>
            <div className="container pt-20 h-full items-center">
                <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                    <div className="w-[30rem]">
                        <ProjectForm projectId={projectsId}
                                     projects={data}
                                     setNewData={setData}
                                     closeSidebar={setShowSidebar}/>
                    </div>
                </Dialog>
                <div className="h-full w-full px-6">

                    <div className="flex-col container items-center">
                        <div className="flex justify-between my-2">
                            <div>Всего активных проектов: {data.length}</div>
                            <button className="bg-[#5970F6] rounded-md text-white px-4 py-2"
                                    onClick={() => {
                                        setProjectId(0)
                                        setShowSidebar(true)
                                    }}>Добавить проект
                            </button>
                        </div>
                        <div className='rounded-[20px] bg-white overflow-hidden pb-4'>
                            <NewTable data={data} setProjectId={setProjectId} setShowSidebar={setShowSidebar}/>
                            <div className="flex px-2 justify-between space-y-2 border-t dark:border-neutral-500">
                                <div className="flex items-center justify-center text-sm font-medium">
                                     <span className="items-center gap-1 text-[18px]">
                                         Страница {data.length !== 0 ? currentPage : 0} из {countPages}
                                     </span>
                                </div>
                                <div className="text-[18px] flex items-center space-x-2 mr-2">
                                    <button
                                        className={currentPage === 1 ? "border rounded p-1 text-gray-300 px-2" : "border rounded p-1 px-2"}
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}>
                                        {'<'}
                                    </button>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium">Размер страницы</p>
                                        <select
                                            className="flex items-center justify-between rounded-md border border-input bg-transparent px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-8 w-[70px]"
                                            value={pageLimit}
                                            onChange={e => {
                                                setCurrentPage(1)
                                                setPageLimit(Number(e.target.value))
                                            }}
                                        >
                                            {[10, 20, 30, 40, 50].map(pageSize => (
                                                <option key={pageSize} value={pageSize}>
                                                    {pageSize}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        className={currentPage === countPages ? "border rounded p-1 text-gray-300 px-2" : "border rounded p-1 px-2"}
                                        disabled={currentPage === countPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}>{'>'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default observer(PersonalAccountTable);