import React from 'react';

export const NavigationMenu = ({ children, className }) => {
    return <nav className={`navigation-menu ${className}`}>{children}</nav>;
};

export const NavigationMenuList = ({ children }) => {
    return <ul className="flex space-x-4">{children}</ul>;
};

export const NavigationMenuLink = ({ children, asChild }) => {
    return <li>{children}</li>;
};