"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Ensure you have the Shadcn utility functions

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                <a href="/" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    <h1>PhotoVault</h1>
                </a>

                {/* Navigation */}
                <nav className="flex space-x-6">
                    <a href="/register" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                        Register
                    </a>
                    <a href="/login" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                        Login
                    </a>
                </nav>
            </div>
        </motion.header>
    );
}
