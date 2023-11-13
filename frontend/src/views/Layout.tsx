import React from 'react';
import Header from "../components/Header/Header";

const Layout = ({children}: { children: React.ReactNode }) => {
    return (
        <div>
            <Header/>
            <div className='block'>
                {children}
            </div>
        </div>
    );
};

export default Layout;