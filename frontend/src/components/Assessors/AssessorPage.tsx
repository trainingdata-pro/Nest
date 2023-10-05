import React, {useContext, useMemo, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import AssessorService from "../../services/AssessorService";
import Header from "../Header/Header";
import PersonalAssessorInfoTable from "./PersonalAssessorInfoTable";
import Dialog from "../UI/Dialog";
import TableLog from "./LoginAndPassword";
import {observer} from "mobx-react-lite";
import AssessorProjects from "./AssessorProjects";
import AssessorHistory from "./AssessorHistory";
import Skills from "./Skills";
import FreeResource from "../AssessorManagement/FreeResource";
import Vacation from "../AssessorManagement/Vacation";
import CurrentState from "./CurrentState";
import { useQuery } from 'react-query';
import Management from "../AssessorManagement/Management";


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
    const assessor = useQuery(['currentAssessor'], () => AssessorService.fetchAssessor(id))


    const [isShowLoginAndPassword, setIsShowLoginAndPassword] = useState(false)
    const [isShowHistory, setIsShowHistory] = useState(false)
    const [showAddToFreeResource, setShowAddToFreeResource] = useState(false)
    const [openVacation, setOpenVacation] = useState(false)
    if (assessor.isLoading) {
        return <div>Загрузка......</div>
    } else {

    return (
        <div>
            <Dialog isOpen={showAddToFreeResource} setIsOpen={setShowAddToFreeResource}>
                <FreeResource assessorId={id}/>
            </Dialog>
            <Dialog isOpen={openVacation} setIsOpen={setOpenVacation}>
                <Vacation assessorId={id} close={setOpenVacation}/>
            </Dialog>
            <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                <AssessorHistory assessorId={id}/>
            </Dialog>
            <Dialog isOpen={isShowLoginAndPassword} setIsOpen={setIsShowLoginAndPassword}>
                <TableLog assessorId={id} setIsShowLoginAndPassword={setIsShowLoginAndPassword}
                          assessorName={`${assessor.data?.last_name} ${assessor.data?.first_name} ${assessor.data?.middle_name}`}/>
            </Dialog>
            <Header/>
            <div className="px-8 pt-20 space-x-2 flex justify-end mb-2">
                <Management setOpenVacation={setOpenVacation} setShowAddToFreeResource={setShowAddToFreeResource}/>
                <button className='bg-[#5970F6] rounded-md text-white px-4 py-2'
                        onClick={() => setIsShowHistory(true)}>История
                </button>
                <button className='bg-[#5970F6] rounded-md text-white px-4 py-2'
                        onClick={() => setIsShowLoginAndPassword(true)}>Логины и пароли
                </button>
            </div>
            <div className='px-8 space-y-4 pb-6'>
                {assessor.isSuccess && <PersonalAssessorInfoTable data={assessor.data} assessorId={id}/>}
                <AssessorProjects assessorId={id}/>
                {assessor.isSuccess && <Skills assessor={assessor.data}/>}
                <div className='flex justify-between'>
                    <div className='flex'>
                        <p>Доступен для свободных ресурсов:</p>
                        <div>
                            <label>Да</label>
                            <input className='disabled:bg-blue-500 cursor-default pointer-events-none' type="checkbox" checked={assessor.data?.state === 'free_resource'}/>
                        </div>
                        <div>
                            <label>Нет</label>
                            <input className='disabled:bg-blue-500 cursor-default pointer-events-none' type="checkbox" checked={assessor.data?.state !== 'free_resource'}/>
                        </div>
                    </div>
                    <CurrentState assessorId={id} vacationDate={assessor.data?.vacation_date}/>
                </div>
            </div>
        </div>
    )}
};

export default observer(AssessorPage);