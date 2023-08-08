import {Link, NavLink, redirect, useNavigate} from "react-router-dom";
import React, {useContext} from "react";
import {Context} from "../../index";
import Profile from "../Profile";
import {observer} from "mobx-react-lite";

const Header = () => {
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const logout = () => {
        store.setAuth(false)
        localStorage.removeItem('token')
        document.cookie = 'refresh='
        navigate('/login')
    }
    return (
        <>
            {store.showProfile && <Profile/>}
            <header className="sticky h-20 border-b border-gray-200 bg-white">
                <div className="flex container mx-auto h-full pr-8 pl-8 items-center">
                    <div className="flex h-full w-full items-center justify-between gap-x-6">
                        <div
                            className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                        >
                            <NavLink
                                to='/dashboard/main'>Service Desk</NavLink>
                        </div>
                        <nav className="relative z-10 flex items-center justify-between">
                            <ul className="flex list-none items-center space-x-1">

                                <div className="flex justify-end">
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                            to='/profile'>Профиль</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                            to='/dashboard/check'>Проверить</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                            to='/blacklist'>Черный список</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                            to='/dashboard/assessors'>Мои исполнители</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                            to='/dashboard/free'>Свободные ресурсы</NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            onClick={() => logout()}
                                            className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                            to='/logout'>Выход</NavLink>
                                    </li>
                                </div>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}

export default observer(Header);