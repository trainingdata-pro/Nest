import React, {useState} from 'react';
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import FreeResource from "../FreeResorces/FreeResource";
import OwnDesires from "../OwnDesires/OwnDesires";
import MyButton from "../../UI/MyButton";
import Select from "react-select";
import MyInput from "../../UI/MyInput";
import {useSkillsFilter} from "./hooks";

const FreeResourcePage = () => {
    const [currentDataType, setCurrentDataType] = useState('free')
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [skillsFilter, setSkillsFilter] = useState<number[]>([])
    const {skills, onSkillsChange, getValueSkills} = useSkillsFilter({skillsFilter: skillsFilter, setSkillsFilter: setSkillsFilter})

    return (
        <>
            <div className='flex justify-between mb-2'>
                <div className="flex space-x-2 items-center">
                    <div className="relative">
                        <MyInput className='border border-black pl-[8px] py-[5px] pr-[30px]'
                               placeholder='Поиск по ФИО/Ник в ТГ' value={globalFilter}
                               onChange={(event) => setGlobalFilter(event.target.value)}/>
                        <MagnifyingGlassIcon className="h-6 w-6 text-black absolute top-[5px] right-[5px]"/>

                    </div>
                    <div className="min-w-[220px]">
                        <Select
                            placeholder='Фильтр по навыкам'
                            options={skills.data ? skills.data : []}
                            isMulti
                            value={getValueSkills()}
                            isSearchable={false}
                            onChange={onSkillsChange}
                        />

                    </div>
                </div>
                <div className='flex justify-end space-x-2'>
                    <MyButton onClick={() => {
                        setCurrentDataType('free')
                    }}>Свободные ресурсы</MyButton>
                    <MyButton onClick={() => {
                        setCurrentDataType('fired')
                    }}>По собственному желанию</MyButton>
                </div>
            </div>
            <div>
                    {currentDataType === 'free' ?
                        <FreeResource skillsFilter={skillsFilter.join(',')} globalFilter={globalFilter}/> :
                        <OwnDesires skillsFilter={skillsFilter.join(',')} globalFilter={globalFilter}/>}
            </div>
        </>
    )
};

export default FreeResourcePage;