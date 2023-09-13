import React, {Fragment, useRef} from 'react'
import {Dialog, Transition } from '@headlessui/react'
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";

function SideBar({children, isOpen, setIsOpen}: {
    children: React.ReactNode,
    isOpen: boolean,
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const cancelButtonRef = useRef(null)
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setIsOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative rounded-lg bg-white text-left shadow-xl transition-all max-w-2xl">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="text-center ">
                                            {children}
                                        </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default SideBar;