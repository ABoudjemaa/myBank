"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";



function AuthLinks() {
    return (
        <>
                <Link href={"/login"} className={"text-gray-300  hover:text-[#FCA311]"}>Login</Link>
                <Link href={"/sign-up"} className={"text-gray-300  hover:text-[#FCA311]"}>Sign Up</Link>
        </>
    );
}

export default AuthLinks;