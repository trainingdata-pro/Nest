import React, {useContext, useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import {Assessor, AssessorWorkingTime} from "../../models/AssessorResponse";
import AssessorService from "../../services/AssessorService";
import {useForm} from "react-hook-form";
import {Context} from "../../index";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import {CheckIcon} from "@heroicons/react/24/solid";
import {IManager} from "../../models/ManagerResponse";
import Header from "../Header/Header";
import PersonalAssessorInfoTable from "./PersonalAssessorInfoTable";
import Dialog from "../UI/Dialog";
import TableLog from "./LoginAndPassword";
import {observer} from "mobx-react-lite";
import AssessorProjects from "./AssessorProjects";
import AssessorHistory from "./AssessorHistory";
import Skills from "./Skills";
import FreeResourse from "../AssessorManagement/FreeResourse";
import Management from "../AssessorManagement/Management";
import Vacation from "../AssessorManagement/Vacation";


export interface AssessorPatch {
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string,
    email: string,
    country: string,
    state: string,
    is_free_resource: boolean,
    free_resource_weekday_hours: number | string,
    free_resource_day_off_hours: number | string,
    manager: string,
    projects: number[],
    skills: number[]
}

const AssessorPage = () => {
    const id = useParams()["id"]
    useMemo(async () => {
        await AssessorService.fetchAssessor(id).then(res => {
            setAssessor(res.data)
        })
    }, [])


    const [assessor, setAssessor] = useState<Assessor>()
    const [isShowLoginAndPassword, setIsShowLoginAndPassword] = useState(false)
    const [isShowHistory, setIsShowHistory] = useState(false)
    const [showAddToFreeResource, setShowAddToFreeResource] = useState(false)
    const [open, setOpen] = useState(false);
    const [openVacation, setOpenVacation] = useState(false)
    if (!assessor){
        return <div>Загрузка......</div>
    }
    return (
        <div>
            <Dialog isOpen={showAddToFreeResource} setIsOpen={setShowAddToFreeResource}>
                <FreeResourse assessorId={id}/>
            </Dialog>
            <Dialog isOpen={openVacation} setIsOpen={setOpenVacation}>
                <Vacation assessorId={id} close={setOpenVacation}/>
            </Dialog>
            <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                <AssessorHistory assessorId={id}/>
            </Dialog>
            <Dialog isOpen={isShowLoginAndPassword} setIsOpen={setIsShowLoginAndPassword}>
                <TableLog assessorId={id} setIsShowLoginAndPassword={setIsShowLoginAndPassword} assessorName={`${assessor.last_name} ${assessor.first_name} ${assessor?.middle_name}`}/>
            </Dialog>
            <Header/>
            <div className="px-8 pt-20 space-x-2 flex justify-end mb-2">
                <div className="justify-center w-36">
                    <div  onMouseLeave={() => setOpen(false)}  className="relative">
                        <button
                            onMouseOver={() => setOpen(true)}
                            className="flex justify-center bg-[#5970F6] rounded-md w-full text-white px-auto py-2"
                        >
                            <span className="">Управление</span>
                        </button>
                        <ul
                            className={`absolute border border-black right-0 bg-white w-full items-center z-10 ${
                                open ? "block" : "hidden"
                            }`}
                        >
                            <li onClick={() => setOpenVacation(true)} className="w-full cursor-pointer border-b border-black text-center py-2 px-2 text-sm hover:bg-gray-100">
                                Отправить в отпуск
                            </li>
                            <li onClick={() => setShowAddToFreeResource(true)} className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                                Отправить в свободные ресурсы
                            </li>
                            <li className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                                Открепить от себя
                            </li>
                            <li className="w-full cursor-pointer text-center py-2 text-sm hover:bg-gray-100">
                                Уволить
                            </li>
                        </ul>
                    </div>
                </div>
                {/*<button className='bg-[#5970F6] rounded-md text-white px-4 py-2' onClick={() => setIsManagement(true)}>Управление</button>*/}
                <button className='bg-[#5970F6] rounded-md text-white px-4 py-2' onClick={() => setIsShowHistory(true)}>История</button>
                <button className='bg-[#5970F6] rounded-md text-white px-4 py-2' onClick={() => setIsShowLoginAndPassword(true)}>Логины и пароли</button>
            </div>
            <div className='px-8 space-y-4 pb-6'>
            <PersonalAssessorInfoTable data={assessor} assessorId={id}/>
            <AssessorProjects assessorId={id}/>
            <Skills assessor={assessor}/>
            </div>
        </div>
    )
};

export default observer(AssessorPage);