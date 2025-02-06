import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Header = () => {
    const [userData, setUserData] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const data = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user_data")) : null;
        if (data) {
            setUserData(data);
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <header className="px-4 md:px-6 bg-gray-100 shadow w-full">
            <div className='container mx-auto flex items-center justify-between py-2'>
                <div className="flex items-center">
                    <Link href="/" className="text-lg font-bold">
                        Task Manager
                    </Link>
                </div>
                <nav className="hidden lg:flex space-x-4">
                    <Link href="/users" className="text-sm font-medium text-gray-700 hover:text-indigo-800">Users</Link>
                    <Link href="/teams" className="text-sm font-medium text-gray-700 hover:text-indigo-800">Teams</Link>
                    <Link href="/tasks" className="text-sm font-medium text-gray-700 hover:text-indigo-800">Tasks</Link>
                </nav>
                <div className="flex items-center space-x-2">
                    {isAuthenticated ? (
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-gray-700 font-medium">
                            {userData.username.charAt(0).toUpperCase()}
                        </span>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-200 text-sm">Login</button>
                            </Link>
                            <Link href="/signup">
                                <button className="px-2 py-1 bg-slate-800 text-white rounded hover:bg-indigo-600 text-sm">Sign Up</button>
                            </Link>
                        </>
                    )}
                </div>
                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <button className="p-2 border rounded">
                        <MenuIcon />
                    </button>
                </div>
            </div>
        </header>
    );
};

function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

export default Header;