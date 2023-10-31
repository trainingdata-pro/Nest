import React, {Fragment, useRef, useState} from 'react'
import {Dialog, Transition} from '@headlessui/react'

function SideBar({children, isOpen, setIsOpen,topLayer}: {
    children: React.ReactNode,
    isOpen: boolean,
    topLayer?: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const cancelButtonRef = useRef(null)

    return (
            <Dialog as="div" open={isOpen} className={`relative ${topLayer ? 'z-30': 'z-10'}`} initialFocus={cancelButtonRef} onClose={setIsOpen}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                <div className={`fixed inset-0 ${topLayer ? 'z-40': 'z-20'} overflow-y-auto`}>
                    <div className="flex min-h-full justify-center p-4 text-center items-start">
                        <Dialog.Panel
                            className="relative rounded-lg bg-white text-left shadow-xl transition-all max-w-[70%]">
                            <div className="bg-white px-4 pb-4">
                                <div className="text-center" ref={cancelButtonRef}>
                                    {children}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
    )
}

export default SideBar;