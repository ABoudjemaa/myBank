"use client"

import {
    Card,
    CardContent,
    // CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React, {useEffect} from "react";
import Logo from "@/components/logo";
import {useAuthStore} from "@/store/use-auth-store";
import {useRouter} from "next/navigation";

export function AuthWrapper({
                                title = 'Welcome back',
                                children,
                            }: { title?: string, children: React.ReactNode }) {
    const {user} = useAuthStore()
    const router = useRouter();

    useEffect(() => {
        if (user)  {
            router.push("/")
        }
    }, []);

    if (user) return null;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 min-w-[300px]">
            <div className="flex w-full items-center max-w-sm flex-col gap-6 min-w-[300px]">
                <Logo/>
                <div className={"flex flex-col gap-6 w-full"}>
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
