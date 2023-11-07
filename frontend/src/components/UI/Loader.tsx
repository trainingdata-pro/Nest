import React from 'react';
import {Spinner} from "@material-tailwind/react";

const Loader = () => {
    return (
        <div className="flex justify-center my-auto h-screen items-center">
            <Spinner className="h-16 w-16 text-gray-900/50" />
        </div>
    );
};

export default Loader;