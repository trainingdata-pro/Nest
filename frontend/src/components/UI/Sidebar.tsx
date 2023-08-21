import React, {useState} from 'react';
// @ts-ignore
const Sidebar = ({showSidebar,setShowSidebar, children}) => {

    return (
        < >
        {showSidebar && (
            <button
                className="flex text-md text-black items-center cursor-pointer fixed right-10 top-4 z-50"
                onClick={() => setShowSidebar(false)}
            >
                x
            </button>
        )}
        {showSidebar && <div onClick={() => setShowSidebar(false)} className="animate-in fade-in fixed inset-0 z-40 backdrop-blur-sm transition-opacity"></div>}
    <div className={`right-0 z-40 top-0 w-[35vw] backdrop-blur-md bg-white fixed p-10 pl-20 text-black h-full ease-in-out duration-300 ${
        showSidebar ? "translate-x-0 " : "translate-x-full"
    }`}>
        {children}
    </div>
    </>
    );
};

export default Sidebar;