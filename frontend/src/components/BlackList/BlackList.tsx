import React, {useState} from 'react';
import AssessorService from "../../services/AssessorService";

import {useQuery} from "react-query";
import Header from "../Header/Header";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";

const BlackList = () => {
    const header = ["Фамилия", "Имя", "Отчество", "Ник в ТГ", "Руководитель", "Проект", "Причина"]
    const [fioFilter, setFioFilter] = useState('')
    const [usernameFilter, setUsernameFilter] = useState('')
    const blacklist = useQuery(['blacklist', fioFilter, usernameFilter], () => AssessorService.getBlackList(usernameFilter, fioFilter))
    return (
        <>
            <Header/>
            <div className='pt-20 items-center'>
                <div className="flex justify-left space-x-2 px-8 my-2">
                    <div className="relative">
                    <input className='border border-black rounded-[8px] px-[8px] py-[5px]' placeholder='Поиск по ФИО' onChange={(event) => setFioFilter(event.target.value)}/>
                    </div>
                    <div className="relative">
                        <input className='border border-black rounded-[8px] px-[8px] py-[5px]' placeholder='Поиск по Нику в ТГ' onChange={(event) => setUsernameFilter(event.target.value)}/>
                        <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>
                    </div>
                    </div>
                <div className='px-8'>
                <table className="w-full text-center">
                    <thead className="">
                    <tr className="bg-[#E7EAFF]">
                        {header.map((col, index) => <th key={index}
                                                        className="border-r dark:border-neutral-500 px-[5px] py-[20px]">{col}</th>)}
                        <th className="px-[5px] py-[20px]"></th>
                    </tr>
                    </thead>
                    {blacklist.data?.results.length !== 0 ? <tbody> {blacklist.data?.results?.map(row =>
                        <tr key={row.id} className="text-center border-t dark:border-neutral-500">
                            <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{row.assessor.last_name}</td>
                            <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{row.assessor.first_name}</td>
                            <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{row.assessor.middle_name}</td>
                            <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{row.assessor.username}</td>
                            <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]"></td>
                            <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]"></td>
                            <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{row.reason.title}</td>
                            <td className="whitespace-nowrap px-[5px] py-[20px] flex justify-center"></td>
                        </tr>)}</tbody> : <tbody>
                    <tr>
                        <td className="p-4 border-b align-middle [&amp;:has([role=checkbox])]:pr-0 h-24 text-center"
                            colSpan={20}>Нет результатов
                        </td>
                    </tr>
                    </tbody>}

                </table>
                </div>
            </div>
        </>
    );
};

export default BlackList;