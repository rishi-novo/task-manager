import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="bg-white-100">
            <Header />
            <main className='container mx-auto py-6'>{children}</main>
        </div>
    );
};

export default Layout; 