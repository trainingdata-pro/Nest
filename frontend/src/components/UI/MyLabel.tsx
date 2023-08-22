import React from 'react';


const MyLabel = ({children, required}:{children: React.ReactNode, required:boolean}) => {
    return (
        <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >{children} {required && <span className="text-red-700">*</span>}</label>
    );
};

export default MyLabel;