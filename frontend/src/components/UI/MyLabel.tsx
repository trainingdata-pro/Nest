import React, {InputHTMLAttributes} from 'react';
import classNames from "classnames";

interface LabelProps extends InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode
}

const MyLabel = ({children, required, className = ''}: LabelProps) => {
    const cn = classNames({
            'text-red-700': required,
            'hidden': !required
        }
    )
    return (
        <label
            className={`font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}
            <span className={cn}>*  </span></label>
    );
};

export default MyLabel;