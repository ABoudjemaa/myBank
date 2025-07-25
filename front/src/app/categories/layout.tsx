import NavBar from "@/components/nav-bar";

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