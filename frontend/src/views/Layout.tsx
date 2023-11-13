import React from 'react';
import Header from "../components/Header/Header";

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div className='h-screen'>
            <Header/>
            <div className='block pt-20 px-8 h-full'>
                {children}
            </div>
        </div>
    );
};

export default Layout;