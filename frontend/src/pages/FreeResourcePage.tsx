import React, {useMemo, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import ProjectService from "../services/ProjectService";
import AssessorService from "../services/AssessorService";
import Header from "../components/Header/Header";
import {useQuery} from "react-query";

const FreeResourcePage = () => {
    const header = useMemo(() => ['Фамилия', 'Имя', 'Отчество', 'Ник в ТГ', 'Последний руководитель', 'Последний проект', 'Кол-во рабочих часов(Будние)', 'Кол-во рабочих часов(выходные)', 'Причина'], [])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageLimit, setPageLimit] = useState(10)
    const {
        data,
        isLoading,
    } = useQuery(['freeResources', currentPage, pageLimit], () => AssessorService.fetchFreeResource(), {
        onSuccess: (data) => {
            console.log(data)
            setTotalRows(data.count)
            setCountPages(Math.ceil(data.count / pageLimit))
        },
        keepPreviousData: true
    })
    const [projectsId, setProjectId] = useState(0)
    const [showSidebar, setShowSidebar] = useState(false)
    const [totalRows, setTotalRows] = useState<number>(0)
    const [countPages, setCountPages] = useState(1)
    return (
        <>
            <Header/>
            <div className='pt-20 mx-8 border border-black rounded-[8px]'>
                <table className="min-w-full text-center">
                    <thead className="">
                    <tr className="bg-[#E7EAFF]">
                        {header.map((col, index) => <th key={index}
                                                        className="border-r dark:border-neutral-500 px-[5px] py-[20px]">{col}</th>)}
                        <th className="px-[5px] py-[20px]"></th>
                    </tr>
                    </thead>
                    {data?.results.length !== 0 ? <tbody> {data?.results.map(assessor => <tr key={assessor.id}
                                                                                             className="text-center border-t dark:border-neutral-500">
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.last_name}</td>
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.first_name}</td>
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.middle_name}</td>
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.username}</td>
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.username}</td>
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.username}</td>
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.free_resource_weekday_hours}</td>
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{assessor.free_resource_day_off_hours}</td>
                        <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{}</td>

                        <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">
                            История
                        </td>
                    </tr>)}</tbody> : <tbody>
                    <tr>
                        <td className="p-4 border-b align-middle [&amp;:has([role=checkbox])]:pr-0 h-24 text-center"
                            colSpan={20}>Нет результатов
                        </td>
                    </tr>
                    </tbody>}

                </table>
                <div className="flex px-2 justify-between space-y-2 border-t dark:border-neutral-500">
                    <div className="flex items-center justify-center text-sm font-medium">
                                     <span className="items-center gap-1 text-[18px]">
                                         Страница {data?.results.length !== 0 ? currentPage : 0} из {countPages}
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
        </>
    );
};

export default FreeResourcePage;