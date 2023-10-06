import React, {useContext} from 'react';
import Header from "../components/Header/Header";
import ProjectService from "../services/ProjectService";
import {Context} from "../index";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import {useQuery} from "react-query";

const CompletedProjects = () => {
    const statusObject = {
        "new": "Новый",
        "pilot": "Пилот",
        "active": "Активный",
        "pause": "На паузе",
        "completed": "Завершенный"
    }
    const header: string[] = ["Asana ID", "Наименование проекта", "Менеджер проекта", "Кол-во ассессеров", "Статус проекта", "Дата начала", "Дата завершения", ""]
    const {store} = useContext(Context)
    const {data} = useQuery(['completedProjects'], () => ProjectService.fetchCompletedProjects(store.user_id))
    return (
        <div>
            <Header/>
            <div className="flex container pt-20 h-full pr-8 pl-8 items-center">
                <div className="h-full w-full">
                    <div className="rounded-t-[20px] border border-b-gray-400 bg-white">
                        <table className="min-w-full text-center">
                            <thead className="">
                            <tr className="bg-[#E7EAFF]">
                                {header.map((col, index) => <th key={index} className="border-r dark:border-neutral-500 px-[5px] py-[20px] last:border-none">{col}</th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {data?.results.length !== 0 ?  (data?.results.map(project => <tr key={project.id} className="text-center border-t dark:border-neutral-500">
                                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.asana_id}</td>
                                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.name}</td>
                                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.manager.map(manager => <span key={manager.id}>{manager.last_name} {manager.first_name}</span>)}</td>
                                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.assessors_count}</td>
                                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{statusObject[project.status]}</td>
                                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.date_of_creation}</td>
                                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.date_of_completion}</td>
                                <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center">
                                    <button className='disabled:opacity-50 disabled:cursor-default' disabled={!store.user_data.is_teamlead}><PencilSquareIcon className="  h-6 w-6 text-gray-500" /></button>
                                </td>
                            </tr>)):
                            <tr>
                                <td className="p-4 border-b align-middle h-24 text-center"
                                    colSpan={20}>Нет результатов
                                </td>
                            </tr>}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedProjects;