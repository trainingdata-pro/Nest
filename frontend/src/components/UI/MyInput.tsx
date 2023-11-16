import React, {InputHTMLAttributes} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    register?: any
}
const MyInput = ({register, className='', ...props}: InputProps ) => {
    return (
        <input
            className={`py-[12px] bg-[#F4F8F7] rounded-[8px] w-full text-left disabled:opacity-50 ${className}`}
            {...register}
            autoFocus={false}
            {...props}/>
    );
};

export default MyInput;