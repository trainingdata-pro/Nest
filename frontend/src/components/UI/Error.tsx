import React from 'react';

const Error = ({children}: {children: React.ReactNode}) => {
    return (
        <p className='h-fit text-red-500 text-sm my-2'>{children}</p>
    );
};

export default Error;