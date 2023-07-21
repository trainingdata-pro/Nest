import {Fragment, useContext, useEffect} from 'react'
import {Menu, Transition} from '@headlessui/react'
import {NavLink, redirect} from "react-router-dom";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

const DropdownMenu = () => {
    const {store} = useContext(Context)
    const logout = () => {
        document.cookie = ''
        localStorage.removeItem('token')
        store.setAuth(false)
    }
    return (
        <Menu as="div" className="relative inline-block">
            <Menu.Button className="">
                <div>
                    <div className="rounded-full p-0.5">
                            <span
                                className="relative flex shrink-0 overflow-hidden rounded-full h-14 border border-gray-400 w-14 bg-amber-50">
                                <span
                                    className="flex h-full w-full items-center justify-center rounded-full bg-muted">{store.managerData.first_name.charAt(0)}{store.managerData.last_name.charAt(0)}</span>
                            </span>
                    </div>
                </div>
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
                    className="absolute z-10 mt-3  right-0 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {({active}) => (
                            <div
                                className={classNames(
                                    active ? '' : '',
                                    'font-bold block px-4 py-2 text-sm border-b-gray-100 border-b-2'
                                )}
                            >
                                {store.managerData.last_name} {store.managerData.first_name} {store.managerData.middle_name}
                            </div>
                        )}
                    </Menu.Item>
                    <div className="py-1">

                        <Menu.Item>
                            {({active}) => (
                                <NavLink
                                    to="/profile"
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'block px-4 py-2 text-sm'
                                    )}
                                >
                                    Перейти в профиль
                                </NavLink>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({active}) => (
                                <div onClick={logout}
                                     className={classNames(
                                         active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                         'block w-full px-4 py-2 text-left text-sm'
                                     )}
                                >
                                    Выйти из аккаунта
                                </div>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default observer(DropdownMenu);