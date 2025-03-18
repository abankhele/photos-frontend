"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Ensure you have the Shadcn utility functions

export default function AuthenticatedHeader({ user }) {
    const [scrolled, setScrolled] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        // Implement your logout logic here
        console.log("Logging out...");
        // Redirect to login page or home page after logout
    };

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-4xl z-50 transition-all duration-300 rounded-2xl",
                scrolled
                    ? "bg-blue-50/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-md"
                    : "bg-blue-50 dark:bg-gray-900 shadow-md"
            )}
        >
            <div className="flex items-center justify-between p-4 md:p-6">
                {/* Visible Title */}
                <a href="/dashboard" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    <h1>PhotoVault</h1>
                </a>

                {/* Navigation */}
                <nav className="flex items-center space-x-6">
                    <a href="/albums" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                        Albums
                    </a>
                    <a href="/search" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                        Search
                    </a>
                    
                    {/* Profile dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                            className="flex items-center space-x-2 focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="hidden md:block text-gray-700 dark:text-gray-300">
                                {user?.name || 'User'}
                            </span>
                        </button>
                        
                        {/* Dropdown menu */}
                        {profileMenuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10"
                            >
                                <a 
                                    href="/profile" 
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Profile Settings
                                </a>
                                <a 
                                    href="/uploads" 
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    My Uploads
                                </a>
                                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Logout
                                </button>
                            </motion.div>
                        )}
                    </div>
                </nav>
            </div>
        </motion.header>
    );
}
