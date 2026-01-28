import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { setAuthData } from "../utils/authUtils";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
            const payload = {
                email: email,
                password: password
            };



            const data = await authAPI.login(payload);

            setAuthData(data.token, data.user);

            if (data.user.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (data.user.role === "SHOPKEEPER") {
                navigate("/shopkeeper/dashboard");
            } else {
                navigate("/citizen/dashboard");
            }



        } catch (err) {
            console.error(err);
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">

                <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">
                    Ration Portal Login
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Sign in to continue
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            placeholder="Enter Your Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-700 font-semibold hover:underline">
                        Register
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

export default Login;
