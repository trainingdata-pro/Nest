import React from 'react';

// @ts-ignore
const MyInput = ({register, placeholder, type, disabled=false} ) => {
    return (
        <input
            className="rounded-md box-border border border-input"
            {...register}
            type={type}
            placeholder={placeholder}
            disabled={disabled}/>
    );
};

export default MyInput;