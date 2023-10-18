import React, {ButtonHTMLAttributes} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode
}

const MyButton = ({children, className,...props}: ButtonProps) => {
    return (
        <button {...props} className={`bg-[#5970F6] text-white rounded-[8px] py-[8px] px-[15px] ${className}`}>{children}</button>
    );
};

export default MyButton;