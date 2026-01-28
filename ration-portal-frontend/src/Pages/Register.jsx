import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { toast } from "react-toastify";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CITIZEN");
    // const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);

        const nameRegex = /^[A-Za-z ]{3,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;


        if (!nameRegex.test(name)) {
            return toast.error("Enter Name with letters and at least 3 characters");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address");
        }

        if (!passwordRegex.test(password)) {
            return toast.error(
                "Password must be at least 6 characters and include uppercase, lowercase, and a Symbol"
            );
        }


        try {
            const payload = {
                name: name,
                email: email,
                password: password,
                role: role
            };

            await authAPI.register(payload);

            toast.success("Registration successful! Please login.");
            navigate("/login");

        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            // setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">

                <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">
                    Create Account
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Ration Distribution System
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-700 focus:outline-none"
                            placeholder="Full Name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-700 focus:outline-none"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-700 focus:outline-none"
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-700 focus:outline-none bg-white"
                        >
                            <option value="CITIZEN">Citizen</option>
                            <option value="SHOPKEEPER">Shopkeeper</option>

                        </select>
                    </div>

                    {role === "SHOPKEEPER" && (
                        <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 p-3 rounded">
                            Shopkeeper accounts require admin approval.
                        </p>
                    )}

                    <button
                        type="submit"
                        // disabled={loading}
                        className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition disabled:opacity-50"
                    >Register
                        {/* {loading ? "Creating account..." : "Register"} */}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-800 font-semibold hover:underline">
                        Login
                    </Link>
                    <br />
                    <Link to="/" className="text-gray-700 font-semibold hover:underline">
                        Home
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;

