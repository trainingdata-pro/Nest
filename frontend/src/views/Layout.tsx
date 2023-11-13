import React from 'react';
import Header from "../components/Header/Header";

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div>
            <Header/>
            <div className='block pt-20 px-8'>
                {children}
            </div>
        </div>
    );
};

export default Layout;