import React, {InputHTMLAttributes} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    register: any
}
const MyInput = ({register, placeholder, type, disabled=false, className=''}: InputProps ) => {
    return (
        <input
            className={`pl-[27px] rounded-md box-border border border-input text-left disabled:opacity-50 py-[3px] ${className}`}
            {...register}
            type={type}
            placeholder={placeholder}
            disabled={disabled}/>
    );
};

export default MyInput;