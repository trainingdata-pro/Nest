import React from 'react';
import MyButton from "../../UI/MyButton";

const AddToProject = ({setAddToProject}: {
    setAddToProject: React.Dispatch<boolean>
}) => {
    return (
        <>
            <h2>Добавить на проект</h2>
            <div className='flex flex-col space-y-2 mb-4'>
                <MyButton>
                    <a href="/assessors/free_resources/" target="_blank">Из свободных ресурсов</a>
                </MyButton>
                <MyButton>
                    <a href="/dashboard/assessors/my/?sorted=asc" target="_blank">Из моих асессоров</a>
                </MyButton>

            </div>
            <MyButton onClick={() => setAddToProject(false)}>Назад</MyButton>
        </>
    );
};

export default AddToProject;