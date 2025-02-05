import React from 'react';

export const Sheet = ({ children }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-4">
                {children}
            </div>
        </div>
    );
};

export const SheetTrigger = ({ children }) => {
    return <div>{children}</div>; // This can be a button or any trigger element
};

export const SheetContent = ({ children, side }) => {
    return <div className={`sheet-content ${side}`}>{children}</div>;
};