"use client"
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserNav from "@/components/user-nav";
import {useAuthStore} from "@/store/use-auth-store";
import AuthLinks from "@/components/auth-links";

const NavBar: React.FC = () => {
    const pathname = usePathname();
    const {user} = useAuthStore()


    return (
        <nav className={cn("bg-[#14213D] p-3 border-b", "shadow-lg")}>
            <div className="container mx-auto flex justify-between items-center max-w-6xl">
                <div className="text-[#FCA311] text-lg font-bold">MyBank</div>
                <div className="flex items-center space-x-4">
                    <Link href="/" className={pathname === "/" ? "text-white font-bold" : "text-gray-300 hover:text-[#FCA311]"}>
                        Home
                    </Link>
                    {user ? <UserNav/> : <AuthLinks/> }
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
