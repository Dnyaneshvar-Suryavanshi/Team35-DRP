import { NavLink } from "react-router-dom";

export const Navbar = () => {
    const linkClass = ({ isActive }) =>
        isActive
            ? "text-blue-700 font-semibold border-b-2 border-blue-600"
            : "text-slate-600 hover:text-blue-700 transition";

    return (
        <>
            <nav className="bg-white/90 backdrop-blur-md
                            border-b border-blue-100
                            px-8 py-4 flex justify-between items-center
                            shadow-sm">

                <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
                    Digital Ration Portal
                </h1>

                <div className="space-x-6 text-sm font-medium">
                    <NavLink to="/" className={linkClass}>Home</NavLink>
                    <NavLink to="/about" className={linkClass}>About</NavLink>
                    <NavLink to="/contact" className={linkClass}>Contact</NavLink>
                    <NavLink
                        to="/login"
                        className="ml-4 px-4 py-2 rounded-full
                                   bg-blue-600 text-white
                                   hover:bg-blue-700 transition shadow"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        className="px-4 py-2 rounded-full
                                   border border-blue-600 text-blue-600
                                   hover:bg-blue-50 transition"
                    >
                        Register
                    </NavLink>
                </div>
            </nav>


            <div className="bg-blue-600 
                            text-white py-2 text-sm font-medium
                            border-b border-blue-200">
                <marquee>
                    Important Notice: All users must register on Ration Portal before 03/01/2026.
                </marquee>
            </div>
        </>
    );
};
