import {NavLink} from "react-router-dom";
import React, {useContext, useState} from "react";
import {Context} from "../../index";
import Profile from "../Profile";
import {observer} from "mobx-react-lite";
import Dialog from "../UI/Dialog";

const Header = () => {
    const {store} = useContext(Context)
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
                <Profile setIsOpen={setIsOpen}/>
            </Dialog>

            <header className="fixed left-0 right-0 h-[70px] rounded-b-[20px] border-b border-gray-200 bg-[#5970F6]">

                <div className="flex mx-auto h-full pr-8 pl-8 items-center">
                    <div className="flex h-full w-full items-center justify-between gap-x-6">
                        <div
                            className="inline-flex bg-[#7a8df8] text-[16px] items-center text-white justify-center rounded-md text-sm font-medium py-[6px] px-[16px]"
                        >
                            <NavLink
                                to='/dashboard/main'>{store.user_data.username}</NavLink>
                        </div>
                        <nav className="relative z-10 flex items-center justify-between text-white">
                            <ul className="flex list-none items-center space-x-1">

                                <div className="flex justify-end">
                                    <li>
                                        <button
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
                                            onClick={() => setIsOpen(true)}>Профиль</button>
                                    </li>
                                    <li>
                                        <NavLink

                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
                                            to='/dashboard/check'>Проверить</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
                                            to='/dashboard/projects/free'>Завершенные</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
                                            to='/assessors/blacklist'>Черный список</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
                                            to='/dashboard/assessors'>Мои исполнители</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 py-2 px-4"
                                            to='/assessors/free_resources'>Свободные ресурсы</NavLink>
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