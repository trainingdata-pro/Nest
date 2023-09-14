import React, {InputHTMLAttributes} from 'react';

interface LabelProps extends InputHTMLAttributes<HTMLInputElement>{
    children: React.ReactNode
}
const MyLabel = ({children, required, className=''}:LabelProps) => {
    return (
        <label
            className={`font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children} {required && <span className="text-red-700">*  </span>}</label>
    );
};

export default MyLabel;