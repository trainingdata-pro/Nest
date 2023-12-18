import React, {Dispatch, FC, useState} from "react";
import Dialog from "../../UI/Dialog";
import Confirm from "../../UI/Confirm";
import ProjectForm from "../ProjectForm/ProjectForm";
import MyButton from "../../UI/MyButton";

interface ICreateForm {
    setShowSidebar: Dispatch<boolean>,
    showSidebar: boolean,
    projectId: number,
    setProjectId: Dispatch<number>
}
export const CreateProject: FC<ICreateForm> = ({setShowSidebar, showSidebar, projectId, setProjectId}) => {
    const [isOpenConfirm, setIsOpenConfirm] = useState(false)
    const closeDialog = () => {
        setIsOpenConfirm(true)
    }
    return <>
        <Dialog isOpen={isOpenConfirm} setIsOpen={() => {
        }} topLayer={true}>
            <Confirm isCloseConfirm={setIsOpenConfirm} isCloseModal={setShowSidebar}/>
        </Dialog>

        <Dialog isOpen={showSidebar} setIsOpen={closeDialog}>
            <ProjectForm projectId={projectId}
                         closeSidebar={closeDialog} isOpenModal={setShowSidebar}/>
        </Dialog>
        <MyButton onClick={() => {
            setProjectId(0)
            setShowSidebar(true)
        }}>Добавить проект
        </MyButton>
    </>
}