import React, {Fragment, useContext, useState} from "react";
import {Context} from "../../index";
import {Menu, Transition} from "@headlessui/react";
import {NavLink} from "react-router-dom";
import {observer} from "mobx-react-lite";
import ConfirmWindow from "./ConfirmWindow";
import {BsThreeDots} from "react-icons/bs";
import Confirm from "./ConfirmWindow";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
// @ts-ignore
function DropdownMenu({id}){
    const {store} = useContext(Context)
    const [confirm, setConfirm] = useState(false)
    const handleDeleteRows = () => {
        setConfirm(true);
    };
    const handleCancelDelete = () => {
        setConfirm(false);
    };
    const handleDeleteOneProject = () => {
        store.deleteProject([id])
        setConfirm(false);
    }
    return (
        <>
        {confirm && (
            <Confirm cancel={handleCancelDelete} confirm={handleDeleteOneProject}/>
        )}
        <Menu as="div" className="inline-block">
            <Menu.Button className="">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted"><BsThreeDots/></span>
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute z-10 mt-3 right-8 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {({active}) => (
                            <div
                                className={classNames(
                                    active ? '' : '',
                                    'font-bold block px-4 py-2 text-sm border-b-gray-100 border-b-2'
                                )}
                            >
                                Действия
                            </div>
                        )}
                    </Menu.Item>
                    <div className="py-1">

                        <Menu.Item>
                            {({active}) => (
                                <NavLink
                                    to={`/dashboard/projects/${id}`}
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block full px-4 py-2 text-sm'
                                    )}
                                >
                                    Редактировать
                                </NavLink>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({active}) => (
                                <div onClick={()=> {
                                    setConfirm(true)
                                }}
                                     className={classNames(
                                         active ? 'bg-gray-100 text-gray-900 cursor-pointer' : 'text-gray-700',
                                         'block w-full px-4 py-2 text-sm'
                                     )}
                                >
                                    Удалить
                                </div>
                            )}
                        </Menu.Item>

                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
        </>
    )
}

export default observer(DropdownMenu)