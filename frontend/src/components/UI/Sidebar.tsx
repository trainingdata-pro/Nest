import React, {useState} from 'react';
// @ts-ignore
const Sidebar = (props, {children}) => {

    return (
        <>
        {props.showSidebar && (
            <button
                className="flex text-4xl text-white items-center cursor-pointer fixed right-10 top-6 z-50"
                onClick={() => props.setShowSidebar(!props.showSidebar)}
            >
                x
            </button>
        )}

    <div className={`right-0 z-10 top-0 w-[35vw] bg-blue-600 fixed p-10 pl-20 text-white h-full ease-in-out duration-300 ${
        props.showSidebar ? "translate-x-0 " : "translate-x-full"
    }`}>
        {children}
    </div>
    </>
    );
};

export default Sidebar;