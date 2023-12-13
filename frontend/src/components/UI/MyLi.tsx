import React, {HTMLProps, ReactNode} from 'react';


interface Props extends HTMLProps<HTMLLIElement>{
    children: ReactNode,
}
const MyLi = ({children, ...props}: Props) => {
    return (
        <li {...props} className="w-full cursor-pointer border-b border-black last:border-none text-center py-2 px-2 text-sm hover:bg-gray-100">
            {children}
        </li>
    );
};

export default MyLi;