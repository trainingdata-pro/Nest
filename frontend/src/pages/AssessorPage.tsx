

import React, {useContext, useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {redirect, useParams} from "react-router-dom";
import AssessorsService from "../services/AssessorsService";
import {Context} from "../index";
import ProjectsService from "../services/ProjectsService";
import Header from "../components/Header/Header";
import ProjectForm from "../components/ProjectForm";
import AssessorForm from "../components/AssessorForm";

export interface addAssessor {
    username: string,
    last_name: string,
    first_name: string,
    middle_name: string
}


const AssessorPage = () => {
    const id = useParams()["id"]
    const [assessor, setAssessor] = useState("")
    useEffect(()=>{
        // @ts-ignore
        AssessorsService.fetchCurrentAssessors(id).then(res => setAssessor(res.data))
    },[])
    const [visible, setVisible] = useState(false)
    return (
        <>
            <Header name={'Добавить исполнителя'} setVisible={setVisible}/>

            <div className="container mx-auto pb-[15rem] pt-10">
                <button className="hover:bg-gray-300 mb-5" >Вернуться назад</button>
                <AssessorForm id={id} assessor={assessor}/>
            </div>
        </>
    )
};

export default AssessorPage;