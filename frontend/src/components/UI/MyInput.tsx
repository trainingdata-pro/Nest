import React, {InputHTMLAttributes} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    register: any
}
const MyInput = ({register, placeholder, type, disabled=false, className=''}: InputProps ) => {
    return (
        <input
            className={`pl-[7px] h-[38px] w-full rounded-md box-border border border-input text-left disabled:opacity-50 ${className}`}
            {...register}
            autoFocus={false}
            type={type}
            placeholder={placeholder}
            disabled={disabled}/>
    );
};

export default MyInput;