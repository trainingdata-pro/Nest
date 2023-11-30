import React, {useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import AssessorService from "../../../services/AssessorService";
import PersonalAssessorInfo from "./PersonalAssessorInfo/PersonalAssessorInfo";
import Dialog from "../../UI/Dialog";
import TableLog from "./LoginAndPassword";
import {observer} from "mobx-react-lite";
import AssessorProjects from "./AssessorProjects/AssessorProjects";
import AssessorHistory from "./AssessorHistory/AssessorHistory";
import Skills from "./Skills";
import CurrentState from "./CurrentState";
import {useQuery} from 'react-query';
import Management from "../../AssessorManagement/Management";
import Loader from "../../UI/Loader";
import {Context} from "../../../index";
import Page404 from "../../../views/Page404";
import MyButton from "../../UI/MyButton";

interface UserParams {
    id: string
}

const AssessorPage = () => {
    const {id} = useParams()
    const assessor = useQuery(['currentAssessor', id], () => AssessorService.fetchAssessor(id), {
        retry: false,
    })
    const {store} = useContext(Context)
    const [isShowLoginAndPassword, setIsShowLoginAndPassword] = useState(false)
    const [isShowHistory, setIsShowHistory] = useState(false)
    const isEnabledManagement = () => {
        if (((assessor.data?.manager.id === store.user_id) || store.user_data.is_teamlead) && id) return (
            <Management assessor={assessor} id={id}/>
        )
    }
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
            <div className="space-x-2 flex justify-end mb-2">
                {isEnabledManagement()}
                <MyButton onClick={() => setIsShowHistory(true)}>История</MyButton>
                <MyButton onClick={() => setIsShowLoginAndPassword(true)}>Логины и пароли</MyButton>
            </div>
            <div className='space-y-4 pb-6'>
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