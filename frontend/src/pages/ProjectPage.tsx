import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import ProjectsService from "../services/ProjectsService";
import Header from "../components/Header/Header";
import {useNavigation} from "react-router-dom";


// @ts-ignore
const ProjectPage = () => {
    const id = useParams()["id"]
    const [projectName, setProjectName] = useState("")
    useEffect(()=>{
        // @ts-ignore
        ProjectsService.fetchCurrentProjects(id).then(res => setProjectName(res.data.name))
    },[])
    return (
        <>
        <Header name={null} children={undefined}/>

        <div className="container mx-auto pb-[15rem] pt-10">
            <button className="hover:bg-gray-300" >Вернуться назад</button>
            <ProjectForm id={id} name={projectName}/>
        </div>
        </>
    );

};

export default ProjectPage;