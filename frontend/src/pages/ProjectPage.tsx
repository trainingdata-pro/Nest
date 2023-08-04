import React, {useEffect, useMemo, useState} from 'react';
import ProjectForm from "../components/ProjectForm";
import {useParams} from "react-router-dom";
import ProjectService from "../services/ProjectService";
import {Project} from "../models/ProjectResponse";
import Loader from "../components/UI/Loader";

const ProjectPage = () => {
    const id = useParams()['id']
    // @ts-ignore
    const [project, setProject] = useState<Project>(null)
    useEffect(()=> {
         ProjectService.fetchProject(id).then(res  => {
            setProject(res.data)
        })
    },[])
    if (!project){
        return <Loader width={16}/>
    }
    return (
        <div>
            <ProjectForm projectData={project}/>
        </div>
    );
};

export default ProjectPage;