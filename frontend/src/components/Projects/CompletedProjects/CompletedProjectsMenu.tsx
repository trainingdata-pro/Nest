import React, {useState} from 'react';
import MyButton from "../../UI/MyButton";
import Dialog from "../../UI/Dialog";
import Export from "../Export";

const CompletedProjectsMenu = () => {
    const [isExportProjects, setIsExportProjects] = useState(false)

    return (
            <div className='my-2 flex justify-end'>
                <Dialog isOpen={isExportProjects} setIsOpen={setIsExportProjects}>
                    <Export setIsExportProjects={setIsExportProjects} exportType='completedProjects'
                            project={undefined}/>
                </Dialog>
                <MyButton onClick={() => setIsExportProjects(true)}>Экспорт</MyButton>
            </div>
    );
};

export default CompletedProjectsMenu;