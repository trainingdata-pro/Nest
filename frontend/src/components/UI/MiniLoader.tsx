import React from 'react';

const MiniLoader = ({size}: {size:number}) => {
    return(
        <div className={`inline-block h-[${size.toString()}px] w-[${size.toString()}px] text-gray-400 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
             role="status"></div>
    );
};

export default MiniLoader;