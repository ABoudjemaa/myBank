const Layout = ({
                    children,
                }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className={"max-w-6xl mx-auto"}>
            {children}
        </div>
    );
};

export default Layout;