import React, {useState} from 'react';
import MyButton from "../UI/MyButton";
import {errorNotification} from "../UI/Notify";

// @ts-ignore
const AssessorsManagement = ({type,setShowRemoveAssessors, setShowChangeProject, availableChangeProject, availableAddProject, setShowAddProject}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="">
            <div onMouseLeave={() => setOpen(false)} className="relative">
                <MyButton onMouseOver={() => setOpen(true)}>Управление</MyButton>
                <ul
                    className={`absolute border border-black right-0 bg-white w-full items-center z-10 ${
                        open ? "block" : "hidden"
                    }`}
                >{type === 'my' && (

                    <li onClick={() => {
                        if (availableChangeProject){
                            setShowChangeProject(true)
                        } else {
                            errorNotification('Выберите хотя бы 1 ассессора')
                        }
                    }} className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                        Изменить проект
                    </li>)}
                    {type === 'my' && (
                    <li onClick={() => {
                        if (availableAddProject){
                            setShowAddProject(true)
                        } else {
                            errorNotification('Выберите хотя бы 1 ассессора')
                        }
                    }} className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                        Добавить на проект
                    </li>)}
                    <li onClick={() => {
                        if (availableAddProject){
                            setShowRemoveAssessors(true)
                    } else {
                        errorNotification('Выберите хотя бы 1 ассессора')
                    }
                    }} className="w-full cursor-pointer text-center py-2 text-sm hover:bg-gray-100">
                        Удалить с проекта
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AssessorsManagement;