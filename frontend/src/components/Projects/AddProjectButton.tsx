import React from 'react';
import {useNavigate} from "react-router-dom";

const AddProjectButton = () => {
    const navigation = useNavigate()
    return (
        <button className="bg-black rounded-md text-white px-4 py-2"
                onClick={() => navigation('/dashboard/projects/add_project')}>Добавить проект
        </button>
    );
};

export default AddProjectButton;