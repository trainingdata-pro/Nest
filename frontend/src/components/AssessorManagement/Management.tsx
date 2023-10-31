import React, {useState} from 'react';
import Dialog from "../UI/Dialog";
import VacationReturn from "./Vacation/VacationReturn/VacationReturn";
import FreeResource from "./FreeResources/SetFreeResource/FreeResource";
import ReturnFromFreeResources from "./FreeResources/ReturnFreeResource/ReturnFromFreeResources";
import Vacation from "./Vacation/Vacation/Vacation";
import Fired from "./Fired/Fired";
import Unpin from "./Unpin/Unpin";

interface ManagerProps {
    id: number | string,
    assessor: any,
}
// @ts-ignore
const Management = ({id, assessor}: ManagerProps) => {
    const [open, setOpen] = useState(false);

    const [showAddToFreeResource, setShowAddToFreeResource] = useState(false)
    const [openVacation, setOpenVacation] = useState(false)
    const [isOpenFired, setIsOpenFired] = useState(false)
    const [isReturnVacation, setIsReturnVacation] = useState(false)
    const [unpin, setUnpin] = useState(false)
    const [isReturnFromFreeResources, setIsReturnFromFreeResources] = useState(false)
    return (
        <>
            <Dialog isOpen={isReturnVacation} setIsOpen={setIsReturnVacation}>
                <VacationReturn assessorId={id} setIsReturnVacation={setIsReturnVacation}/>
            </Dialog>
            <Dialog isOpen={showAddToFreeResource} setIsOpen={setShowAddToFreeResource}>
                {assessor.isSuccess && id && <FreeResource assessorId={id} setShowAddToFreeResource={setShowAddToFreeResource}/>}
            </Dialog>
            <Dialog isOpen={isReturnFromFreeResources} setIsOpen={setIsReturnFromFreeResources}>
                {assessor.isSuccess && id && <ReturnFromFreeResources assessorId={id} show={setIsReturnFromFreeResources}/>}
            </Dialog>
            <Dialog isOpen={openVacation} setIsOpen={setOpenVacation}>
                <Vacation assessorId={id} close={setOpenVacation}/>
            </Dialog>

            <Dialog isOpen={isOpenFired} setIsOpen={setIsOpenFired}>
                <Fired assessorId={id} close={setIsOpenFired}/>
            </Dialog>
            <Dialog isOpen={unpin} setIsOpen={setUnpin}>
                {assessor.isSuccess && id && <Unpin assessor={assessor.data} assessorId={id} close={setUnpin}/>}
            </Dialog>
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
                    {assessor.data.state !== 'vacation' ?
                        <li onClick={() => setOpenVacation(true)}
                            className="w-full cursor-pointer border-b border-black text-center py-2 px-2 text-sm hover:bg-gray-100">
                            Отправить в отпуск
                        </li> :
                        <li onClick={() => setIsReturnVacation(true)}
                            className="w-full cursor-pointer border-b border-black text-center py-2 px-2 text-sm hover:bg-gray-100">
                            Вернуть из отпуска
                        </li>
                    }
                    {assessor.data.state !== 'free_resource' ?
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
        </>
    );
};

export default Management;