import React, {HTMLProps, LiHTMLAttributes, useState} from 'react';
import Dialog from "../UI/Dialog";
import VacationReturn from "./VacationReturn";
import FreeResource from "./FreeResource";
import ReturnFromFreeResources from "./ReturnFromFreeResources";
import Vacation from "./Vacation";
import AssessorHistory from "../Assessors/AssessorHistory";
import Fired from "./Fired";
import Unpin from "./Unpin";
import TableLog from "../Assessors/LoginAndPassword";
import {Assessor} from "../../models/AssessorResponse";
import MyButton from "../UI/MyButton";

interface ListElementProps extends LiHTMLAttributes<HTMLLIElement> {
    children: React.ReactNode
}

const ListElement = ({children, ...props}: ListElementProps) => {
    return (<li {...props}
                className="w-full cursor-pointer border-b border-black text-center py-2 px-2 text-sm hover:bg-gray-100">
        {children}
    </li>)
}
const Management = ({assessor}: {
    assessor: Assessor
}) => {

    const [showAddToFreeResource, setShowAddToFreeResource] = useState(false)
    const [openVacation, setOpenVacation] = useState(false)
    const [isOpenFired, setIsOpenFired] = useState(false)
    const [isReturnVacation, setIsReturnVacation] = useState(false)
    const [unpin, setUnpin] = useState(false)
    const [isReturnFromFreeResources, setIsReturnFromFreeResources] = useState(false)
    const [open, setOpen] = useState(false);
    return (
        <>
            <Dialog isOpen={isReturnVacation} setIsOpen={setIsReturnVacation}>
                <VacationReturn assessorId={assessor.id} setIsReturnVacation={setIsReturnVacation}/>
            </Dialog>
            <Dialog isOpen={showAddToFreeResource} setIsOpen={setShowAddToFreeResource}>
                <FreeResource assessorId={assessor.id} setShowAddToFreeResource={setShowAddToFreeResource}/>
            </Dialog>
            <Dialog isOpen={isReturnFromFreeResources} setIsOpen={setIsReturnFromFreeResources}>
                <ReturnFromFreeResources assessorId={assessor.id} show={setIsReturnFromFreeResources}/>
            </Dialog>
            <Dialog isOpen={openVacation} setIsOpen={setOpenVacation}>
                <Vacation assessorId={assessor.id} close={setOpenVacation}/>
            </Dialog>

            <Dialog isOpen={isOpenFired} setIsOpen={setIsOpenFired}>
                <Fired assessorId={assessor.id} close={setIsOpenFired}/>
            </Dialog>
            <Dialog isOpen={unpin} setIsOpen={setUnpin}>
                <Unpin assessor={assessor} assessorId={assessor.id} close={setUnpin}/>
            </Dialog>
            <div className="justify-center w-36">
                <div onMouseLeave={() => setOpen(false)} className="relative">
                    <MyButton onMouseOver={() => setOpen(true)} className='w-full'>Управление</MyButton>
                    <ul
                        className={`absolute border border-black right-0 bg-white w-full items-center z-10 ${
                            open ? "block" : "hidden"
                        }`}
                    >
                        {assessor.state !== 'vacation' ?
                            <ListElement onClick={() => setOpenVacation(true)}>
                                Отправить в отпуск
                            </ListElement> :
                            <ListElement onClick={() => setIsReturnVacation(true)}>
                                Вернуть из отпуска
                            </ListElement>
                        }
                        {assessor.state !== 'free_resource' ?
                            <ListElement onClick={() => setShowAddToFreeResource(true)}>
                                Отправить в свободные ресурсы
                            </ListElement> :
                            <ListElement onClick={() => setIsReturnFromFreeResources(true)}>
                                Вернуть из свободных ресурсов
                            </ListElement>
                        }
                        <ListElement onClick={() => setUnpin(true)}>
                            Открепить от себя
                        </ListElement>
                        <ListElement onClick={() => setIsOpenFired(true)}>
                            Уволить
                        </ListElement>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Management;