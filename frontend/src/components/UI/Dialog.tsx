import React, {Fragment, useRef} from 'react'
import {Dialog, Transition} from '@headlessui/react'
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
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                <div className="fixed inset-0 z-20 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Dialog.Panel
                            className="relative rounded-lg bg-white text-left shadow-xl transition-all max-w-max">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="text-center ">
                                    {children}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>

    )
}

export default SideBar;