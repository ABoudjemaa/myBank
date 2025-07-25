import NavBar from "@/components/nav-bar";
import Footer from "@/components/footer";


function Home() {
    return (
        <>
            <NavBar/>
            <main className="max-w-6xl mx-auto px-4 py-12 text-center hero-section">
                <h1 className="text-4xl font-bold text-[#14213D] mb-4">Welcome to MyBank</h1>
                <p className="text-lg text-gray-700">
                    Manage your expenses easily and stay in control of your money.
                </p>
                <div className={"flex justify-center items-center"}>
                <img src={'/mybank.png'} alt={'mybank'}/>
                </div>
            </main>
            <Footer/>
        </>

    );
}

export default Home;