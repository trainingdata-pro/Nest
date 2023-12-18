import React from 'react';
import {Spinner} from "@material-tailwind/react";

const Loader = ({height}: {
    height?: string
}) => {
    return (
        <div className={`absolute top-0 flex justify-center h-full w-full items-center`}>
            <Spinner className="h-16 w-16 text-gray-900/50" />
        </div>
    );
};

export default Loader;