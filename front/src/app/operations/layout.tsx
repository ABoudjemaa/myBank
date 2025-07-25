import NavBar from "@/components/nav-bar";
import {Toaster} from "@/components/ui/sonner";

const Layout = ({
                    children,
                }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <NavBar/>
            <main className="max-w-6xl mx-auto">
                {children}
            </main>
        </>
    );
};

export default Layout;