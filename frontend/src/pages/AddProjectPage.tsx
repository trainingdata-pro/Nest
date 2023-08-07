import React from 'react';
import ProjectForm from "../components/ProjectForm";
import {Project} from "../models/ProjectResponse";
import { format } from 'date-fns';
const AddProjectPage = () => {
    const project:Project = {
        id: 0,
        name: '',
        manager: [],
        assessors_count: 0,
        backlog: '',
        asana_id: 0,
        speed_per_hour: 0,
        price_for_assessor: 0,
        price_for_costumer: 0,
        unloading_value: 0,
        unloading_regularity: 0,
        status: '',
        date_of_creation: ''
    }
    return (
        <div>
            <ProjectForm projectData={project}/>
        </div>
    );
};

export default AddProjectPage;