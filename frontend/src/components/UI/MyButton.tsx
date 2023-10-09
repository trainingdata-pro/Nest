import React, {ButtonHTMLAttributes, FC} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode
}

const MyButton = ({children, ...props}: ButtonProps) => {
    return (
        <button {...props} className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2">{children}</button>
    );
};

export default MyButton;