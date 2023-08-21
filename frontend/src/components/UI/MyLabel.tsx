import React from 'react';

// @ts-ignore
const MyLabel = ({children, required}) => {
    return (
        <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >{children} {required && <span className="text-red-700">*</span>}</label>
    );
};

export default MyLabel;