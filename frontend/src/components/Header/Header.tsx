import {NavLink} from "react-router-dom";
import React, {useContext, useState} from "react";
import {Context} from "../../index";
import Profile from "./Profile/Profile";
import {observer} from "mobx-react-lite";
import Dialog from "../UI/Dialog";
import CheckAssessor from "./CheckAssessor";

const Header = () => {
    const {store} = useContext(Context)
    const [isOpenCheck, setIsOpenCheck] = useState(false)
    return (
        <>

            <Dialog isOpen={isOpenCheck} setIsOpen={setIsOpenCheck}>
                <CheckAssessor/>
            </Dialog>
            <header className="fixed z-10 left-0 top-0 right-0 h-[70px] overflow-hidden rounded-b-[20px] border-b border-gray-200 bg-[#5970F6]">

                <div className="flex mx-auto h-full pr-8 pl-8 items-center">
                    <div className="flex h-full w-full items-center justify-between gap-x-6">
                        <div
                            className="inline-flex bg-[#7a8df8] text-[16px] items-center text-white justify-center rounded-md text-sm font-medium py-[6px] px-[16px]"
                        >
                            <NavLink className='flex space-x-4 items-center'
                                to='/projects'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 38 38" fill="none">
                                <path d="M31.3164 18.9998C31.3164 25.8004 25.8032 31.312 19.0012 31.312C12.202 31.312 6.68888 25.8004 6.68888 18.9998C6.68888 12.1998 12.202 6.68638 19.0012 6.68638V2.47825C9.8778 2.47825 2.47826 9.87531 2.47826 18.9998C2.47826 23.5618 4.32883 27.692 7.31949 30.6824C10.3074 33.6731 14.4381 35.5217 19.0012 35.5217C23.5671 35.5217 27.6951 33.6731 30.6857 30.6824C33.6736 27.692 35.5242 23.5618 35.5242 18.9998H31.3164Z" fill="white"/>
                                <path d="M11.3104 11.3115C9.3417 13.2797 8.12625 15.9983 8.12625 19.0005H10.8971C10.8971 14.5247 14.5244 10.8971 19.0002 10.8971C23.4759 10.8971 27.106 14.5247 27.106 19.0005C27.106 23.4765 23.4759 27.1052 19.0002 27.1052V29.875C25.0068 29.875 29.8741 25.0063 29.8741 19.0005C29.8741 15.9983 28.6587 13.2797 26.69 11.3115C24.724 9.34312 22.0049 8.12655 19.0002 8.12655C15.9982 8.12655 13.2791 9.34312 11.3104 11.3115Z" fill="#AD0018"/>
                            </svg><p className='text-[20px]'>N E S T</p></NavLink>
                        </div>
                        <nav className="relative z-10 flex items-center justify-between text-white">
                            <ul className="flex list-none items-center space-x-1">

                                <div className="flex justify-end">
                                    <Profile/>
                                    <li>
                                        <button
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
                                            onClick={() => setIsOpenCheck(true)}>Проверить</button>
                                    </li>
                                    <li>
                                        <NavLink
                                            className={({isActive}) => `${isActive? 'text-black' : ''} inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4`}
                                            to='/projects/completed'>Завершенные</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className={({isActive}) => `${isActive? 'text-black' : ''} inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4`}                                            to='/blacklist'>Черный список</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className={({isActive}) => `${isActive? 'text-black' : ''} inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4`}                                            to='/assessors'>Мои исполнители</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className={({isActive}) => `${isActive? 'text-black' : ''} inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4`}                                            to='/free_resources'>Свободные ресурсы</NavLink>
                                    </li>
                                </div>
                            </ul>
                        </nav>
                        <NavLink
                            onClick={() => store.logout()}
                            className="inline-flex border border-white text-white items-center justify-center rounded-md text-sm font-medium transition-colors py-[6px] px-[16px]"
                            to='/logout'>Выход</NavLink>
                    </div>
                </div>
            </header>
        </>
    )
}

export default observer(Header);