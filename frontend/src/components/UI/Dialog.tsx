import React, {useRef} from 'react'
import {Dialog} from '@headlessui/react'
import classNames from "classnames";

function SideBar({children, isOpen, setIsOpen,topLayer}: {
    children: React.ReactNode,
    isOpen: boolean,
    topLayer?: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const cnDialog = classNames('relative', {
        'z-20': topLayer,
        'z-10': !topLayer
    })
    const cnLayer = classNames('fixed inset-0 overflow-y-auto', {
        'z-20': topLayer,
        'z-10': !topLayer
    })
    const cancelButtonRef = useRef(null)
    return (
        <>
            <Dialog as="div" open={isOpen} className={cnDialog} initialFocus={cancelButtonRef} onClose={setIsOpen}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                <div className={cnLayer}>
                    <div className="flex justify-center text-center pt-2">
                        <Dialog.Panel
                            className="relative rounded-lg bg-white text-left shadow-xl transition-all max-w-[70%]">
                            <div className="bg-white px-4 ">
                                <div className="text-center px-4 py-4 max-h-[calc(100vh-20px)] overflow-y-auto overflow-x-hidden" ref={cancelButtonRef}>
                                    {children}
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default SideBar;