function Footer() {
    return (
        <footer className="bg-[#14213D] text-white py-6 mt-10">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} myBank — All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
