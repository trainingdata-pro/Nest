import React from 'react';

// @ts-ignore
const MyInput = ({register, placeholder, type, disabled=false} ) => {
    return (
        <input
            className="flex h-8 rounded-md border border-input bg-transparent px-3 mt-2 py-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
            {...register}
            type={type}
            placeholder={placeholder}
            disabled={disabled}/>
    );
};

export default MyInput;