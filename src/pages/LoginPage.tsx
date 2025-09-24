import { useState } from "react";
import Input from "../components/ui/Input";
import BreastBeaconLogo from "../Logo/Logo";
import Button from "../components/ui/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleLoginError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string }>;
            
            if (axiosError.response?.data?.message) {
                setError(axiosError.response.data.message);
            } else if (axiosError.response?.status === 401) {
                setError('Invalid email or password');
            } else if (axiosError.response?.status === 403) {
                setError('Account not verified. Please check your email.');
            } else if (axiosError.response?.status === 429) {
                setError('Too many attempts. Please try again later.');
            } else if (axiosError.code === 'ECONNABORTED') {
                setError('Request timeout. Please try again.');
            } else if (axiosError.message === 'Network Error') {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } else if (error instanceof Error) {
            setError(error.message);
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            setError("");
            setLoading(true);

            if (!email || !password) {
                setError("Email and password are required");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError("Please enter a valid email address");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters long");
                return;
            }

            // axios POST request to backend
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
                email: email.toLowerCase().trim(),
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            const { data } = response;

            if (data.success) {
                // Store authentication data
                localStorage.setItem('authToken', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));

                // Set default authorization header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;

                // Navigate to dashboard
                navigate('/dashboard', { replace: true });

            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error: unknown) {
            handleLoginError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(email, password);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <BreastBeaconLogo />
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-800 mb-2">Login</h1>
                    <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <Input
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleEmail}
                                placeholder="Enter your email address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <Input
                                name="password"
                                type="password"
                                value={password}
                                onChange={handlePassword}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Login Button */}
                        <Button
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:scale-105"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                                    Logging in...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </Button>

                        {/* Forgot Password Link */}
                        <div className="text-center">
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Forgot your password?
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    onClick={() => navigate('/register')}
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};