import React, {Dispatch, useState} from 'react';
import MyButton from "../../UI/MyButton";
import {errorNotification} from "../../UI/Notify";
import Dialog from "../../UI/Dialog";
import ChangeProjects from "./ChangeProjects/ChangeProjects";
import AddToProject from "./AddToProjects/AddToProject";
import RemoveAssessorsFromProjects from './RemoveAssessorsFromProjects/RemoveAssessorsFromProjects';
import {Row} from "@tanstack/react-table";
import {Assessor} from "../../../models/AssessorResponse";

const AssessorsManagement = ({type, availablePopup, selectedRows, setSelectedRow}: {
    type: string,
    availablePopup: boolean,
    selectedRows: Row<Assessor>[],
    setSelectedRow: Dispatch<Row<Assessor>[]>
}) => {
    const [open, setOpen] = useState(false);
    const [showChangeProject, setShowChangeProject] = useState(false)
    const [showAddProject, setShowAddProject] = useState(false)
    const [showRemoveAssessors, setShowRemoveAssessors] = useState(false)
    const checkProjects = () => {
        return selectedRows.find(row => row.original.projects.length === 0) === undefined
    }
    return (
        <>
            <Dialog isOpen={showChangeProject} setIsOpen={setShowChangeProject}>
                <ChangeProjects show={setShowChangeProject} assessorsRow={selectedRows}
                                setAssessorsRow={setSelectedRow}/>
            </Dialog>
            <Dialog isOpen={showAddProject} setIsOpen={setShowAddProject}>
                <AddToProject show={setShowAddProject} assessorsRow={selectedRows} setAssessorsRow={setSelectedRow}/>
            </Dialog>
            <Dialog isOpen={showRemoveAssessors} setIsOpen={setShowRemoveAssessors}>
                <RemoveAssessorsFromProjects assessorsRow={selectedRows} setAssessorsRow={setSelectedRow}
                                             show={setShowRemoveAssessors}/>
            </Dialog>
            <div>
                <div onMouseLeave={() => setOpen(false)} className="relative">
                    <MyButton onMouseOver={() => setOpen(true)}>Управление</MyButton>
                    <ul
                        className={`absolute border border-black right-0 bg-white w-full items-center z-10 ${
                            open ? "block" : "hidden"
                        }`}
                    >{type === 'personal' && (

                        <li onClick={() => {
                            if (checkProjects()) {
                                if (availablePopup) {
                                    setShowChangeProject(true)
                                } else {
                                    errorNotification('Выберите хотя бы 1 ассессора')
                                }
                            } else {
                                errorNotification('Действие изменить проект недоступно, если у одного из асессеров нет проектов')
                            }
                        }}
                            className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                            Изменить проект
                        </li>)}
                        {type === 'personal' && (
                            <li onClick={() => {
                                if (availablePopup) {
                                    setShowAddProject(true)
                                } else {
                                    errorNotification('Выберите хотя бы 1 ассессора')
                                }
                            }}
                                className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                                Добавить на проект
                            </li>)}
                        <li onClick={() => {
                            if (checkProjects()) {
                                if (availablePopup) {
                                    setShowRemoveAssessors(true)
                                } else {
                                    errorNotification('Выберите хотя бы 1 ассессора')
                                }
                            } else {
                                errorNotification('Действие удалить с проекта недоступно, если у одного из асессеров нет проектов')
                            }

                        }} className="w-full cursor-pointer text-center py-2 text-sm hover:bg-gray-100">
                            Удалить с проекта
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AssessorsManagement;