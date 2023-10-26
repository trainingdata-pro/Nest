import React from 'react';

// @ts-ignore
const Loader = ({width}) => {
    return (
        <div className={"flex h-screen justify-center items-center"}>
            <div className={`inline-block h-[30px] w-[30px] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
            role="status">
        </div></div>
    );
};

export default Loader;