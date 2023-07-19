import {Link, NavLink, redirect} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Context} from "../../index";
import DropdownMenu from "./Profile";
import {observer} from "mobx-react-lite";
import { RxPlus } from "react-icons/rx";
import AddProject from "../AddProject";


// @ts-ignore
const Header = ({name, setVisible}) => {
    return (
        <header className="sticky h-20 border-b border-gray-200 bg-white">
            <div className="container mx-auto h-full pr-8 pl-8">
                <div className="flex h-full w-full items-center gap-x-6">
                    <nav className="relative z-10 flex flex-1 items-center justify-start">
                        <div className="relative">
                            <ul className="group flex flex-1 list-none items-center justify-center space-x-1">
                                <li>
                                    <NavLink
                                        className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                        to='/dashboard/team'>Команда</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="inline-flex items-center hover:bg-gray-200 justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                                        to='/dashboard/projects'>Проекты</NavLink>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div onClick={()=> setVisible(true)} className="justify-center bg-black cursor-pointer hover:bg-black/80 text-white rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 flex items-center gap-x-2">
                        <RxPlus/> {name}
                    </div>

                    <DropdownMenu/>

                </div>
            </div>
        </header>
    )
}

export default Header;