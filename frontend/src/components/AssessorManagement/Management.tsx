import React, {useState} from 'react';
import Dialog from "../UI/Dialog";
import FreeResourse from "./FreeResource";

// @ts-ignore
const Management = ({setOpenVacation, setShowAddToFreeResource}) => {
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
                    <li onClick={() => setOpenVacation(true)}
                        className="w-full cursor-pointer border-b border-black text-center py-2 px-2 text-sm hover:bg-gray-100">
                        Отправить в отпуск
                    </li>
                    <li onClick={() => setShowAddToFreeResource(true)}
                        className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                        Отправить в свободные ресурсы
                    </li>
                    <li className="w-full cursor-pointer border-b border-black text-center py-2 text-sm hover:bg-gray-100">
                        Открепить от себя
                    </li>
                    <li className="w-full cursor-pointer text-center py-2 text-sm hover:bg-gray-100">
                        Уволить
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Management;