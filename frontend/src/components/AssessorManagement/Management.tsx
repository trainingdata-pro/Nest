import React, {useState} from 'react';
import Dialog from "../UI/Dialog";
import FreeResourse from "./FreeResource";
import {useMutation} from "react-query";
import AssessorService from "../../services/AssessorService";

// @ts-ignore
const Management = ({
                        setIsReturnFromFreeResources,
                        setUnpin,
                        assessorState,
                        setOpenVacation,
                        setShowAddToFreeResource,
                        setIsOpenFired,
                        setIsReturnVacation
                    }:
                        {
                            setIsReturnFromFreeResources: any,
                            setUnpin: any,
                            assessorState: any,
                            setOpenVacation: any,
                            setShowAddToFreeResource: any,
                            setIsOpenFired: any,
                            setIsReturnVacation: any
                        }) => {
    const [open, setOpen] = useState(false);
    return (
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
                    {assessorState !== 'vacation' ?
                        <li onClick={() => setOpenVacation(true)}
                            className="w-full cursor-pointer border-b border-black text-center py-2 px-2 text-sm hover:bg-gray-100">
                            Отправить в отпуск
                        </li> :
                        <li onClick={() => setIsReturnVacation(true)}
                            className="w-full cursor-pointer border-b border-black text-center py-2 px-2 text-sm hover:bg-gray-100">
                            Вернуть из отпуска
                        </li>
                    }
                    {assessorState !== 'free_resource' ?
                        <li onClick={() => setShowAddToFreeResource(true)}
                            className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                            Отправить в свободные ресурсы
                        </li> :
                        <li onClick={() => setIsReturnFromFreeResources(true)}
                            className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                            Вернуть из свободных ресурсов
                        </li>
                    }
                    <li onClick={() => setUnpin(true)}
                        className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                        Открепить от себя
                    </li>
                    <li onClick={() => setIsOpenFired(true)}
                        className="w-full cursor-pointer text-center py-2 text-sm hover:bg-gray-100">
                        Уволить
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Management;