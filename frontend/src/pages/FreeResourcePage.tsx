import React, {useMemo, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {MagnifyingGlassIcon, PencilSquareIcon} from "@heroicons/react/24/solid";
import ProjectService from "../services/ProjectService";
import AssessorService from "../services/AssessorService";
import Header from "../components/Header/Header";
import {useQuery} from "react-query";
import FreeResourceTableRow from "../components/FreeResource/FreeResorces/FreeResourceEdit";
import FreeResource from "../components/FreeResource/FreeResorces/FreeResource";
import OwnDesires from "../components/FreeResource/OwnDesires/OwnDesires";
import MyButton from "../components/UI/MyButton";

const FreeResourcePage = () => {
    const [currentDataType, setCurrentDataType] = useState('free')
    const [globalFilter, setGlobalFilter] = React.useState('')

    return (
        <>
            <Header/>
            <div className='pt-20 mx-8 rounded-[8px] pb-[20px]'>
                <div className='flex justify-between mb-2'>
                    <div className="flex space-x-2 items-center">
                        <div className="relative">
                            <input className='border border-black rounded-[8px] px-[8px] py-[5px] pr-[30px]'
                                   placeholder='Поиск по ФИО' value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)}/>
                            <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>

                        </div>
                    </div>
                    <div className='flex justify-end space-x-2'>

                        <MyButton onClick={() => {
                            setCurrentDataType('free')
                            setGlobalFilter('')
                        }}>Свободные ресурсы</MyButton>
                        <MyButton onClick={() => {
                            setCurrentDataType('fired')
                            setGlobalFilter('')
                        }}>По собственному желанию</MyButton>
                    </div>
                </div>
                <div>
                    <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                    {currentDataType === 'free' ? <FreeResource setGlobalFilter={setGlobalFilter} globalFilter={globalFilter}/> : <OwnDesires setGlobalFilter={setGlobalFilter} globalFilter={globalFilter}/>}
                    </div>
                    </div>
            </div>
        </>
    )
};

export default FreeResourcePage;