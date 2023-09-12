import React, {InputHTMLAttributes} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    register: any
}
const MyInput = ({register, placeholder, type, disabled=false, className=''}: InputProps ) => {
    return (
        <input
            className={`rounded-md box-border border border-input text-center disabled:opacity-50 py-[8px] px-[12px] w-full ${className}`}
            {...register}
            type={type}
            placeholder={placeholder}
            disabled={disabled}/>
    );
};

export default MyInput;