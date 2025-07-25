'use client';
import React from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";
import {activeLinkClasses} from "@/lib/active-link-classes";
import {useAuthStore} from "@/store/use-auth-store";
import {Button} from "@/components/ui/button";

const UserNav = () => {
    const pathname = usePathname();
    return (
        <>
            <Link href="/categories" className={activeLinkClasses("/categories", pathname)}>
                Categories
            </Link>
            <Link href="/operations" className={activeLinkClasses("/operations", pathname)}>
                Operations
            </Link>
        </>
    );
};

export default UserNav;