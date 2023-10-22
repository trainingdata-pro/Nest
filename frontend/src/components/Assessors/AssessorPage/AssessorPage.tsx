import React, {useContext, useMemo, useState} from 'react';
import {NavLink, useNavigate, useParams} from "react-router-dom";
import AssessorService from "../../../services/AssessorService";
import Header from "../../Header/Header";
import PersonalAssessorInfo from "./PersonalAssessorInfo";
import Dialog from "../../UI/Dialog";
import TableLog from "../LoginAndPassword";
import {observer} from "mobx-react-lite";
import AssessorProjects from "./AssessorProjects";
import AssessorHistory from "../AssessorHistory";
import Skills from "./Skills";
import FreeResource from "../../AssessorManagement/FreeResource";
import Vacation from "../../AssessorManagement/Vacation";
import CurrentState from "../CurrentState";
import {useQuery} from 'react-query';
import Management from "../../AssessorManagement/Management";
import Fired from "../../AssessorManagement/Fired";
import Loader from "../../UI/Loader";
import VacationReturn from "../../AssessorManagement/VacationReturn";
import {toast, ToastContainer} from "react-toastify";
import Unpin from "../../AssessorManagement/Unpin";
import ReturnFromFreeResources from "../../AssessorManagement/ReturnFromFreeResources";
import {Context} from "../../../index";
import MyButton from "../../UI/MyButton";


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
        },
        onSuccess: data => {
            setAssessorState(data.state)
        }
    })
    const [assessorState, setAssessorState] = useState('')
    const {store} = useContext(Context)
    const [isShowHistory, setIsShowHistory] = useState(false)
    const [isShowLoginAndPassword, setIsShowLoginAndPassword] = useState(false)
    if (assessor.isLoading) {
        return <Loader width={50}/>
    } else {
        return (
            <div>
                <Dialog isOpen={isShowLoginAndPassword} setIsOpen={setIsShowLoginAndPassword}>
                    <TableLog assessorId={assessor.data?.id} setIsShowLoginAndPassword={setIsShowLoginAndPassword}
                              assessorName={`${assessor.data?.last_name} ${assessor.data?.first_name} ${assessor.data?.middle_name}`}/>
                </Dialog>
                <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                    <AssessorHistory assessorId={assessor.data?.id}/>
                </Dialog>
                <Header/>
                <div className="px-8 pt-20 space-x-2 flex justify-end mb-2">
                    {assessor.data?.manager.id === store.user_id && <Management assessor={assessor.data}/>}
                    <MyButton onClick={() => setIsShowHistory(true)}>История</MyButton>
                    <MyButton onClick={() => setIsShowLoginAndPassword(true)}>Логины и пароли</MyButton>
                </div>
                <div className='px-8 space-y-4 pb-6'>
                    {assessor.isSuccess && <PersonalAssessorInfo assessorId={id}/>}
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