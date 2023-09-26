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


export interface AssessorPatch {
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string,
    email: string,
    country: string,
    status: string,
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
    if (!assessor){
        return <div>Загрузка......</div>
    }
    return (
        <div>
            <Dialog isOpen={isShowLoginAndPassword} setIsOpen={setIsShowLoginAndPassword}>
                <TableLog/>
            </Dialog>
            <Header/>
            <div className="container pt-24">
                <button>Управление</button>
                <button>История</button>
                <button onClick={() => setIsShowLoginAndPassword(true)}>Логины и пароли</button>

            </div>
            <PersonalAssessorInfoTable data={assessor}/>
        </div>
    )
};

export default observer(AssessorPage);