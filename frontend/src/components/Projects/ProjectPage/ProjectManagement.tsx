import React, {useState} from 'react';
import {errorNotification} from "../../UI/Notify";
import Dialog from "../../UI/Dialog";
import SetCompleted from "./SetCompleted";
import SetPause from "./SetPause";

const ProjectManagement = ({project}:{
    project: number | string | undefined
}) => {
    const [open, setOpen] = useState(false);
    const [isShowCompleteProject, setIsShowCompleteProject] = useState(false)
    const [isShowPauseProject, setIsShowPauseProject] = useState(false)
    return (
        <div>
            {project && <Dialog isOpen={isShowCompleteProject} setIsOpen={setIsShowCompleteProject}>
                <SetCompleted projectId={project} show={setIsShowCompleteProject}/>
            </Dialog>}
            {project && <Dialog isOpen={isShowPauseProject} setIsOpen={setIsShowPauseProject}>
                <SetPause show={setIsShowPauseProject} projectId={project}/>
            </Dialog>}
            <div className="justify-center w-36">
                <div onMouseLeave={() => setOpen(false)} className="relative">
                    <button
                        onMouseOver={() => setOpen(true)}
                        className="flex justify-center bg-[#5970F6] rounded-md w-full text-white px-auto py-2"
                    >
                        <span className="">Управление</span>
                    </button>
                    <ul
                        className={`absolute border border-black right-0 bg-white w-full items-center z-10 ${
                            open ? "block" : "hidden"
                        }`}
                    >
                        <li onClick={() => setIsShowPauseProject(true)} className="w-full cursor-pointer text-center py-2 text-sm hover:bg-gray-100">
                            Поставить проект на паузу
                        </li>
                        <li onClick={() => setIsShowCompleteProject(true)} className="w-full cursor-pointer text-center py-2 text-sm hover:bg-gray-100">
                            Завершить проект
                        </li>
                    </ul>
                </div>
            </div>
        </div>)
};

export default ProjectManagement;