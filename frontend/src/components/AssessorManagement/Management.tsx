import React, {HTMLProps, useState} from 'react';
import VacationReturn from "./Vacation/VacationReturn/VacationReturn";
import FreeResource from "./FreeResources/SetFreeResource/FreeResource";
import ReturnFromFreeResources from "./FreeResources/ReturnFreeResource/ReturnFromFreeResources";
import Vacation from "./Vacation/Vacation/Vacation";
import Fired from "./Fired/Fired";
import Unpin from "./Unpin/Unpin";
import MyButton from "../UI/MyButton";
import classNames from "classnames";
import MyLi from "../UI/MyLi";
import {Assessor} from "../../models/AssessorResponse";

interface ManagementProps {
    assessor: Assessor,
}

export interface Props extends HTMLProps<HTMLDivElement> {
    assessorId: number | string,
    setIsOpenDropDown?: any
}
const Management = ({assessor}: ManagementProps) => {
    const [open, setOpen] = useState(false);
    const cn = classNames("absolute border border-black  right-0 bg-white w-full items-center z-10", {
        'block': open,
        'hidden': !open
    })

    return (
        <div className="justify-center w-40">
            <div onMouseLeave={() => setOpen(false)} className="relative">
                <MyButton
                    onMouseOver={() => setOpen(true)}
                    className="w-full"
                >
                    Управление
                </MyButton>
                <ul className={cn}>
                    {assessor.state !== 'vacation' ?
                        <MyLi>
                            <Vacation assessorId={assessor.id} setIsOpenDropDown={setOpen}/>
                        </MyLi>
                        :
                        <MyLi>
                            <VacationReturn assessorId={assessor.id} setIsOpenDropDown={setOpen}/>
                        </MyLi>
                    }
                    {assessor.state !== 'free_resource' ?
                        <MyLi>
                            <FreeResource assessorId={assessor.id} setIsOpenDropDown={setOpen}/>
                        </MyLi>
                        :
                        <MyLi>
                            <ReturnFromFreeResources assessorId={assessor.id} setIsOpenDropDown={setOpen}/>
                        </MyLi>
                    }
                    <MyLi>
                        <Unpin assessor={assessor} assessorId={assessor.id} setIsOpenDropDown={setOpen}/>
                    </MyLi>
                    <MyLi>
                        <Fired assessorId={assessor.id} setIsOpenDropDown={setOpen}/>
                    </MyLi>
                </ul>
            </div>
        </div>
    );
};

export default Management;