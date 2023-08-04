import React from 'react';

// @ts-ignore
const Loader = ({width}) => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className={`animate-spin rounded-full h-${width} w-${width} border-t-2 border-b-2 border-gray-900`}></div>
        </div>
    );
};

export default Loader;