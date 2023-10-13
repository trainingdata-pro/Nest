import React, {useMemo, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {MagnifyingGlassIcon, PencilSquareIcon} from "@heroicons/react/24/solid";
import ProjectService from "../services/ProjectService";
import AssessorService from "../services/AssessorService";
import Header from "../components/Header/Header";
import {useQuery} from "react-query";
import FreeResourceTableRow from "./FreeResourceTableRow";
import FreeResource from "../components/FreeResource/FreeResource";
import OwnDesires from "../components/FreeResource/OwnDesires";
import MyButton from "../components/UI/MyButton";

const FreeResourcePage = () => {
    const [currentDataType, setCurrentDataType] = useState('free')
    const [fioFilter, setFioFilter] = useState('')
    const [usernameFilter, setUsernameFilter] = useState('')
    return (
        <>
            <Header/>
            <div className='pt-20 mx-8 rounded-[8px]'>
                <div className='flex justify-between mb-2'>
                    <div className="flex space-x-2 items-center">
                        <div className="relative">
                            <input className='border border-black rounded-[8px] px-[8px] py-[5px]'
                                   placeholder='Поиск по ФИО' value={fioFilter} onChange={(event) => setFioFilter(event.target.value)}/>
                            <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>

                        </div>
                        <div className="relative">
                            <input className='border border-black rounded-[8px] px-[8px] py-[5px]'
                                   placeholder='Поиск по Нику в ТГ'
                                   value={usernameFilter}
                                   onChange={(event) => setUsernameFilter(event.target.value)}/>
                            <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>
                        </div>
                    </div>
                    <div className='flex justify-end space-x-2'>

                        <MyButton onClick={() => {
                            setCurrentDataType('free')
                            setFioFilter('')
                            setUsernameFilter('')
                        }}>Свободные ресурсы</MyButton>
                        <MyButton onClick={() => {
                            setCurrentDataType('fired')
                            setFioFilter('')
                            setUsernameFilter('')
                        }}>По собственному желанию</MyButton>
                    </div>
                </div>
                <div>
                    <div className='rounded-[20px] bg-white overflow-hidden pb-4 overflow-x-auto'>
                    {currentDataType === 'free' ? <FreeResource fioQuery={fioFilter} usernameQuery={usernameFilter}/> : <OwnDesires fioQuery={fioFilter} usernameQuery={usernameFilter}/>}
                    </div>
                    </div>
            </div>
        </>
    )
};

export default FreeResourcePage;