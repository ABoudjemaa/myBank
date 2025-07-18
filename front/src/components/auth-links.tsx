"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";



function AuthLinks() {
    return (
        <>
            <Button asChild variant="outline">
                <Link href={"/login"}>Login</Link>
            </Button>
            <Button asChild >
                <Link href={"/sign-up"}>Sign Up</Link>
            </Button>
        </>
    );
}

export default AuthLinks;