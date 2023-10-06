import React, {useState} from 'react';

// @ts-ignore
const ProjectMenu = ({setIsDeleteFromProject}) => {
    const [open, setOpen] = useState(false);
    return (
        <div>
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
                        <li onClick={() => setIsDeleteFromProject(true)}
                            className="w-full cursor-pointer text-center py-2 text-sm hover:bg-gray-100">
                            Убрать с проекта
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProjectMenu;