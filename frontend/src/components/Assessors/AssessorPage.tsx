import React, {useContext, useMemo, useState} from 'react';
import {NavLink, useNavigate, useParams} from "react-router-dom";
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
import {useQuery} from 'react-query';
import Management from "../AssessorManagement/Management";
import Fired from "../AssessorManagement/Fired";
import Loader from "../UI/Loader";
import VacationReturn from "../AssessorManagement/VacationReturn";


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
    const navigate = useNavigate()
    const assessor = useQuery(['currentAssessor', id], () => AssessorService.fetchAssessor(id), {
        onError: (err: any) => {
            if (err.response.status === 404) {
                navigate(-1)
            }
        }
    })
    const [isShowLoginAndPassword, setIsShowLoginAndPassword] = useState(false)
    const [isShowHistory, setIsShowHistory] = useState(false)
    const [showAddToFreeResource, setShowAddToFreeResource] = useState(false)
    const [openVacation, setOpenVacation] = useState(false)
    const [isOpenFired, setIsOpenFired] = useState(false)
    const [isReturnVacation, setIsReturnVacation] = useState(false)
    if (assessor.isLoading) {
        return <Loader width={50}/>
    } else {
        return (
            <div>
                <Dialog isOpen={isReturnVacation} setIsOpen={setIsReturnVacation}>
                    <VacationReturn assessorId={id} setIsReturnVacation={setIsReturnVacation}/>
                </Dialog>
                <Dialog isOpen={showAddToFreeResource} setIsOpen={setShowAddToFreeResource}>
                    <FreeResource assessorId={id}/>
                </Dialog>
                <Dialog isOpen={openVacation} setIsOpen={setOpenVacation}>
                    <Vacation assessorId={id} close={setOpenVacation}/>
                </Dialog>
                <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                    <AssessorHistory assessorId={id}/>
                </Dialog>
                <Dialog isOpen={isOpenFired} setIsOpen={setIsOpenFired}>
                    <Fired assessorId={id} close={setIsOpenFired}/>
                </Dialog>
                <Dialog isOpen={isShowLoginAndPassword} setIsOpen={setIsShowLoginAndPassword}>
                    <TableLog assessorId={id} setIsShowLoginAndPassword={setIsShowLoginAndPassword}
                              assessorName={`${assessor.data?.last_name} ${assessor.data?.first_name} ${assessor.data?.middle_name}`}/>
                </Dialog>
                <Header/>
                <div className="px-8 pt-20 space-x-2 flex justify-end mb-2">
                    <Management assessorState={assessor.data?.state} setIsReturnVacation={setIsReturnVacation} setOpenVacation={setOpenVacation} setIsOpenFired={setIsOpenFired}
                                setShowAddToFreeResource={setShowAddToFreeResource}/>
                    <button className='bg-[#5970F6] rounded-md text-white px-4 py-2'
                            onClick={() => setIsShowHistory(true)}>История
                    </button>
                    <button className='bg-[#5970F6] rounded-md text-white px-4 py-2'
                            onClick={() => setIsShowLoginAndPassword(true)}>Логины и пароли
                    </button>
                </div>
                <div className='px-8 space-y-4 pb-6'>
                    {assessor.isSuccess && <PersonalAssessorInfoTable assessorId={id}/>}
                    {assessor.isSuccess && <AssessorProjects assessorId={id}/>}
                    {assessor.isSuccess && <Skills assessor={assessor.data}/>}
                    <div className='flex justify-between'>
                        <CurrentState assessorId={id} vacationDate={assessor.data?.vacation_date}/>
                    </div>
                </div>
            </div>
        )
    }
};

export default observer(AssessorPage);