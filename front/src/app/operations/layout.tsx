import NavBar from "@/components/nav-bar";
import {Toaster} from "@/components/ui/sonner";
import Footer from "@/components/footer";

const Layout = ({
                    children,
                }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <NavBar/>
            <main className="max-w-6xl mx-auto hero-section">
                {children}
            </main>
            <Footer/>
        </>
    );
};

export default Layout;