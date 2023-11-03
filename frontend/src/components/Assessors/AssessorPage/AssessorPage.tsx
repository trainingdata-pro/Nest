import React, {useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import AssessorService from "../../../services/AssessorService";
import Header from "../../Header/Header";
import PersonalAssessorInfo from "./PersonalAssessorInfo";
import Dialog from "../../UI/Dialog";
import TableLog from "./LoginAndPassword";
import {observer} from "mobx-react-lite";
import AssessorProjects from "./AssessorProjects";
import AssessorHistory from "./AssessorHistory/AssessorHistory";
import Skills from "./Skills";
import CurrentState from "./CurrentState";
import {useQuery} from 'react-query';
import Management from "../../AssessorManagement/Management";
import Loader from "../../UI/Loader";
import {Context} from "../../../index";
import Page404 from "../../../pages/Page404";

const AssessorPage = () => {
    const id = useParams()["id"]
    const assessor = useQuery(['currentAssessor', id], () => AssessorService.fetchAssessor(id), {
        retry: false,
    })
    const {store} = useContext(Context)
    const [isShowLoginAndPassword, setIsShowLoginAndPassword] = useState(false)
    const [isShowHistory, setIsShowHistory] = useState(false)
    if (assessor.isLoading) return <Loader/>
    if (assessor.isError) return <Page404/>
    return (
        <div>
            <Dialog isOpen={isShowLoginAndPassword} setIsOpen={setIsShowLoginAndPassword}>
                <TableLog assessorId={id} setIsShowLoginAndPassword={setIsShowLoginAndPassword}
                          assessorName={`${assessor.data?.last_name} ${assessor.data?.first_name} ${assessor.data?.middle_name}`}/>
            </Dialog>
            <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                <AssessorHistory assessorId={id}/>
            </Dialog>
            <Header/>
            <div className="px-8 pt-20 space-x-2 flex justify-end mb-2">
                {((assessor.data?.manager.id === store.user_id) || store.user_data.is_teamlead) && id &&
                    <Management assessor={assessor} id={id}/>}
                <button className='bg-[#5970F6] rounded-md text-white px-4 py-2'
                        onClick={() => setIsShowHistory(true)}>История
                </button>
                <button className='bg-[#5970F6] rounded-md text-white px-4 py-2'
                        onClick={() => setIsShowLoginAndPassword(true)}>Логины и пароли
                </button>
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

};

export default observer(AssessorPage);