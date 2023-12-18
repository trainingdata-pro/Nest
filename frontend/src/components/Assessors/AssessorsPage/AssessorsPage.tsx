import React, {useState} from 'react';

import AddAssessorForm from "../AssessorForm/AddAssessorForm";
import Dialog from "../../UI/Dialog";
import Header from "../../Header/Header";

import MyButton from "../../UI/MyButton";
import PersonalAssessors from "./PersonalAssessors/PersonalAssessors";
import RentAssessors from "./RentAssessors/RentAssessors";
import Confirm from "../../UI/Confirm";
import MyInput from "../../UI/MyInput";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {useFilterSKills} from "./PersonalAssessors/queries";
import Select from "react-select";


const AssessorsPage = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [assessorType, setAssessorsType] = useState('personal')
    const [isOpenConfirm, setIsOpenConfirm] = useState(false)
    const [globalFilter, setGlobalFilter] = React.useState('')
    const {skills, skillsFilter, onSkillsChange, getValueSkills} = useFilterSKills()

    const closeDialog = () => {
        setIsOpenConfirm(true)
    }
    const confirmAction = () => {

    }
    return (
        <>
            <Dialog isOpen={isOpenConfirm} setIsOpen={confirmAction} topLayer={true}>
                <Confirm isCloseConfirm={setIsOpenConfirm} isCloseModal={setShowSidebar}/>
            </Dialog>

            <Dialog isOpen={showSidebar} setIsOpen={closeDialog}>
                <AddAssessorForm project={undefined} setShowSidebar={closeDialog} isOpenModal={setShowSidebar}/>
            </Dialog>
            <Header/>
            <div className='mt-20 mx-8 rounded-[8px] pb-[20px]'>
                    <div className='flex justify-between mb-2 space-x-2'>
                        <div className="flex space-x-2 items-center">
                            <MyButton onClick={() => setAssessorsType('personal')}>Привязанные ассессоры</MyButton>
                            <MyButton onClick={() => setAssessorsType('rent')}>Арендованные ассессоры</MyButton>
                        </div>
                        <div className='my-auto'>
                            <p className='my-auto'>{assessorType === 'personal' ? 'Привязанные ассессоры': 'Арендованные ассессоры'}</p>
                        </div>
                        <div className='flex space-x-2 justify-end'>

                            <MyButton onClick={() => setShowSidebar(true)}>Создать асессора</MyButton>
                        </div>
                    </div>
                <div className='flex space-x-2'>
                    <div className="relative max-w-[210px]">
                        <MyInput className='border border-gray-400 pl-[8px] py-[6px] pr-[30px]'
                                 placeholder='Поиск по ФИО/Ник в ТГ' value={globalFilter}
                                 onChange={(event) => setGlobalFilter(event.target.value)}/>
                        <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>
                    </div>
                    <div className="min-w-[220px]">
                        <Select
                            placeholder='Фильтр по навыкам'
                            options={skills.isSuccess ? skills.data : []}
                            isMulti
                            value={getValueSkills()}
                            isSearchable={false}
                            onChange={onSkillsChange}
                        />

                    </div>
                </div>
                <div className='relative mt-[10px]'>
                        {assessorType === 'personal' ? <PersonalAssessors globalFilter={globalFilter} skillsFilter={skillsFilter}/> :
                            <RentAssessors globalFilter={globalFilter} skillsFilter={skillsFilter}/>}
                </div>
            </div>
        </>
    );
};

export default AssessorsPage;
