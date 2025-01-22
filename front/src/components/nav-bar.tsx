"use client"
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar: React.FC = () => {
    const pathname = usePathname();

    const getLinkClass = (path: string) => {
        return cn(
            "text-gray-300 hover:text-white",
            pathname === path && "text-white font-bold"
        );
    };

    return (
        <nav className={cn("bg-gray-800 p-3 border-b", "shadow-lg")}>
            <div className="container mx-auto flex justify-between items-center max-w-6xl">
                <div className="text-white text-lg font-bold">MyBank</div>
                <div className="flex space-x-4">
                    <Link href="/" className={getLinkClass("/")}>
                        Home
                    </Link>
                    <Link href="/categories" className={getLinkClass("/categories")}>
                        Categories
                    </Link>
                    <Link href="/operations" className={getLinkClass("/operations")}>
                        Operations
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
