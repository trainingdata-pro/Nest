import React, {useState} from 'react';
import {useQuery} from "react-query";
import AssessorService from "../../services/AssessorService";
import FreeResourceTableRow from "../../pages/FreeResourceTableRow";
import FiredTableRow from "../../pages/FiredTableRow";

const OwnDesires = ({fioQuery, usernameQuery}:
                        { fioQuery: string,
                            usernameQuery: string}) => {
    const header = ['Фамилия', 'Имя', 'Отчество', 'Ник в ТГ', 'Последний руководитель', 'Последний проект', 'Причина увольнения', 'Навыки','Дата ухода','Предполагаемая дата возвращения']
    const [currentPage, setCurrentPage] = useState(1)
    const [pageLimit, setPageLimit] = useState(10)
    const fired = useQuery(['fired', currentPage, pageLimit, fioQuery,usernameQuery], () => AssessorService.fetchFired(usernameQuery, fioQuery,currentPage, pageLimit), {
        onSuccess: (data) => {
            setTotalRows(data.count)
            setCountPages(Math.ceil(data.count / pageLimit))
        },
        keepPreviousData: true
    })
    const [totalRows, setTotalRows] = useState<number>(0)
    const [countPages, setCountPages] = useState(0)

    return (
        <div>
            <table className="min-w-full text-center">
                <thead className="">
                <tr className="bg-[#E7EAFF]">
                    {header.map((col, index) => <th key={index}
                                                    className="border-r dark:border-neutral-500 py-[5px]">{col}</th>)}
                    <th className="py-[20px]"></th>
                </tr>
                </thead>
                {fired.data?.results.length !== 0 ?
                    <tbody>
                    {fired.data?.results.map(assessor =>
                        <FiredTableRow key={assessor.id} assessor={assessor}/>)}
                    </tbody> :
                    <tbody>
                    <tr>
                        <td className="p-4 border-b align-middle [&amp;:has([role=checkbox])]:pr-0 h-24 text-center"
                            colSpan={20}>Нет результатов
                        </td>
                    </tr>
                    </tbody>
                }

            </table>
            <div className="flex px-2 justify-between space-y-2 border-t dark:border-neutral-500">
                <div className="flex items-center justify-center text-sm font-medium">
                                                  <span className="items-center gap-1 text-[18px]">
                                          Страница {fired.data?.results.length !== 0 ? currentPage : 0} из {countPages}
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
    );
};

export default OwnDesires;